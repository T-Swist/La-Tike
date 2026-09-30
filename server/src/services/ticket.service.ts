import crypto from 'crypto';
import { Prisma, UserRole } from '@prisma/client';
import prisma from '../config/database';
import env from '../config/env';
import logger from '../config/logger';
import { getStripe } from '../config/stripe';
import { AuthUser } from '../types';
import { PurchaseInput, ScanInput } from '../validators';
import { generateQRCodeData, verifyQRCode, generateQRCodeImage } from '../utils/qrcode';
import { sendTicketEmail } from '../utils/email';
import { AppError, badRequest, conflict, notFound } from '../utils/AppError';

const SERVICE_FEE_RATE = 0.05;
const PLATFORM_FEE_RATE = 0.03;

type OrderItem = { ticketTypeId: string; quantity: number; unitPrice: number; name: string };

type ScanResult = 'VALID' | 'ALREADY_USED' | 'CANCELLED' | 'REFUNDED' | 'INVALID' | 'NOT_YOUR_EVENT' | 'WRONG_EVENT';

const round2 = (n: number) => Math.round(n * 100) / 100;

const ticketInclude = {
  ticketType: { select: { id: true, name: true, price: true } },
  event: {
    select: {
      id: true,
      title: true,
      startDate: true,
      endDate: true,
      location: true,
      venue: true,
      address: true,
      coverImage: true,
      status: true,
    },
  },
} satisfies Prisma.TicketInclude;

export class TicketService {
  async purchaseTickets(userId: string, dto: PurchaseInput) {
    const event = await prisma.event.findUnique({
      where: { id: dto.eventId },
      include: { ticketTypes: true },
    });

    if (!event) {
      throw notFound('Event not found');
    }

    if (event.status !== 'PUBLISHED' || event.endDate < new Date()) {
      throw badRequest('Event is not available for ticket purchase');
    }

    const now = new Date();
    const items: OrderItem[] = [];

    for (const item of dto.tickets) {
      const ticketType = event.ticketTypes.find((tt) => tt.id === item.ticketTypeId);

      if (!ticketType) {
        throw badRequest(`Ticket type ${item.ticketTypeId} not found for this event`);
      }

      if (items.some((i) => i.ticketTypeId === ticketType.id)) {
        throw badRequest(`Ticket type ${ticketType.name} is listed more than once`);
      }

      if (
        !ticketType.isActive ||
        (ticketType.salesStartDate && ticketType.salesStartDate > now) ||
        (ticketType.salesEndDate && ticketType.salesEndDate < now)
      ) {
        throw badRequest(`${ticketType.name} tickets are not on sale`);
      }

      if (item.quantity < ticketType.minPerOrder || item.quantity > ticketType.maxPerOrder) {
        throw badRequest(
          `Quantity for ${ticketType.name} must be between ${ticketType.minPerOrder} and ${ticketType.maxPerOrder}`
        );
      }

      if (ticketType.quantity - ticketType.sold < item.quantity) {
        throw conflict(`Not enough ${ticketType.name} tickets left`, 'SOLD_OUT');
      }

      items.push({
        ticketTypeId: ticketType.id,
        quantity: item.quantity,
        unitPrice: ticketType.price,
        name: ticketType.name,
      });
    }

    const subtotal = round2(items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0));
    const serviceFee = round2(subtotal * SERVICE_FEE_RATE);
    const platformFee = round2(subtotal * PLATFORM_FEE_RATE);
    const totalAmount = round2(subtotal + serviceFee + platformFee);

    const order = await prisma.order.create({
      data: {
        userId,
        eventId: event.id,
        totalAmount,
        serviceFee,
        platformFee,
        status: 'PENDING',
        items: items as unknown as Prisma.InputJsonValue,
      },
    });

    // Free orders skip payment entirely.
    if (totalAmount === 0) {
      const result = await this.fulfilOrder(order.id);
      return { order: result.order, tickets: result.tickets, requiresPayment: false };
    }

    let paymentIntentId: string;
    let clientSecret: string | null = null;

    if (env.paymentsMode === 'stripe') {
      const intent = await getStripe().paymentIntents.create({
        amount: Math.round(totalAmount * 100),
        currency: env.CURRENCY,
        metadata: { orderId: order.id, userId, eventId: event.id },
      });
      paymentIntentId = intent.id;
      clientSecret = intent.client_secret;
    } else {
      paymentIntentId = `mock_${order.id}`;
    }

    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: totalAmount,
        currency: env.CURRENCY,
        status: 'PENDING',
        stripePaymentIntent: paymentIntentId,
      },
    });

    return {
      order,
      requiresPayment: true,
      paymentMode: env.paymentsMode,
      paymentIntentId,
      clientSecret,
    };
  }

  async confirmPayment(userId: string, paymentIntentId: string) {
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentIntent: paymentIntentId },
      include: { order: true },
    });

    if (!payment || payment.order.userId !== userId) {
      throw notFound('Payment not found');
    }

    if (payment.order.status === 'COMPLETED') {
      return { success: true, ...(await this.getOrderTickets(payment.orderId)) };
    }

    if (payment.order.status !== 'PENDING') {
      throw badRequest(`Order is ${payment.order.status.toLowerCase()}`);
    }

    if (paymentIntentId.startsWith('mock_')) {
      if (env.paymentsMode !== 'mock') {
        throw badRequest('Mock payments are disabled');
      }
      await this.markPaymentSucceeded(payment.id, paymentIntentId, 'mock');
    } else {
      const intent = await getStripe().paymentIntents.retrieve(paymentIntentId);
      if (intent.status !== 'succeeded') {
        return { success: false, status: intent.status };
      }
      if (intent.amount_received !== Math.round(payment.amount * 100)) {
        throw badRequest('Payment amount does not match the order total');
      }
      await this.markPaymentSucceeded(payment.id, intent.id, intent.payment_method_types[0]);
    }

    const result = await this.fulfilOrder(payment.orderId);
    return { success: true, ...result };
  }

  // Called from the Stripe webhook; safe to run more than once for the same intent.
  async handlePaymentSucceeded(paymentIntentId: string) {
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentIntent: paymentIntentId },
      include: { order: true },
    });
    if (!payment || payment.order.status !== 'PENDING') {
      return;
    }
    await this.markPaymentSucceeded(payment.id, paymentIntentId, 'card');
    await this.fulfilOrder(payment.orderId);
  }

  private async markPaymentSucceeded(paymentId: string, stripePaymentId: string, method?: string) {
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'SUCCEEDED', stripePaymentId, paymentMethod: method },
    });
  }

  // Reserves stock atomically and issues tickets. Idempotent: an order that is
  // already COMPLETED just returns its existing tickets.
  private async fulfilOrder(orderId: string) {
    try {
      const issued = await prisma.$transaction(async (tx) => {
        const claimed = await tx.order.updateMany({
          where: { id: orderId, status: 'PENDING' },
          data: { status: 'COMPLETED' },
        });
        if (claimed.count === 0) {
          return false;
        }

        const order = await tx.order.findUniqueOrThrow({
          where: { id: orderId },
          include: { user: { select: { firstName: true, lastName: true, email: true } } },
        });
        const items = (order.items ?? []) as unknown as OrderItem[];

        for (const item of items) {
          const reserved = await tx.$executeRaw`
            UPDATE "ticket_types"
            SET "sold" = "sold" + ${item.quantity}, "updatedAt" = NOW()
            WHERE "id" = ${item.ticketTypeId} AND "sold" + ${item.quantity} <= "quantity"`;
          if (reserved === 0) {
            throw conflict(`${item.name} sold out before your order completed`, 'SOLD_OUT');
          }
        }

        const tickets = items.flatMap((item) =>
          Array.from({ length: item.quantity }, () => {
            const id = crypto.randomUUID();
            const qrCode = generateQRCodeData(id);
            return {
              id,
              orderId,
              eventId: order.eventId,
              ticketTypeId: item.ticketTypeId,
              qrCode,
              qrHash: qrCode.split('.')[2],
              holderName: `${order.user.firstName} ${order.user.lastName}`,
              holderEmail: order.user.email,
            };
          })
        );

        await tx.ticket.createMany({ data: tickets });
        return true;
      });

      const result = await this.getOrderTickets(orderId);
      if (issued) {
        this.emailTickets(result.order.user.email, result.tickets);
      }
      return result;
    } catch (error) {
      if (error instanceof AppError && error.code === 'SOLD_OUT') {
        await prisma.order.update({ where: { id: orderId }, data: { status: 'FAILED' } });
        // A paid Stripe order that could not be fulfilled needs a refund.
        logger.warn('Order failed because tickets sold out', { orderId });
      }
      throw error;
    }
  }

  private async getOrderTickets(orderId: string) {
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      include: {
        user: { select: { email: true } },
        tickets: { include: ticketInclude, orderBy: { createdAt: 'asc' } },
      },
    });
    const { tickets, ...orderData } = order;
    return { order: orderData, tickets: await this.withQrImages(tickets) };
  }

  private emailTickets(
    email: string,
    tickets: Array<{ qrImage: string; ticketType: { name: string }; event: { title: string } }>
  ) {
    if (tickets.length === 0) return;
    sendTicketEmail(
      email,
      tickets[0].event.title,
      tickets.map((t) => ({ qrCode: t.qrImage, ticketType: t.ticketType.name }))
    ).catch((error) => logger.error('Failed to send ticket email', { error: error.message }));
  }

  private async withQrImages<T extends { qrCode: string }>(tickets: T[]) {
    return Promise.all(
      tickets.map(async (ticket) => ({
        ...ticket,
        qrImage: await generateQRCodeImage(ticket.qrCode),
      }))
    );
  }

  async scanTicket(scanner: AuthUser, dto: ScanInput) {
    const respond = (result: ScanResult, message: string, ticket?: any) => ({
      result,
      valid: result === 'VALID',
      message,
      ticket,
    });

    const { ticketId, isValid } = verifyQRCode(dto.qrCode);
    if (!isValid) {
      return respond('INVALID', 'This is not a valid La-Tike ticket');
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        event: { select: { id: true, title: true, hostId: true, startDate: true } },
        ticketType: { select: { name: true } },
        order: { select: { user: { select: { firstName: true, lastName: true } } } },
      },
    });

    if (!ticket || ticket.qrCode !== dto.qrCode.trim()) {
      return respond('INVALID', 'Ticket not found');
    }

    if (scanner.role !== UserRole.ADMIN && ticket.event.hostId !== scanner.id) {
      return respond('NOT_YOUR_EVENT', 'This ticket belongs to an event you do not host');
    }

    if (dto.eventId && dto.eventId !== ticket.eventId) {
      return respond('WRONG_EVENT', `This ticket is for ${ticket.event.title}`);
    }

    const summary = {
      id: ticket.id,
      eventTitle: ticket.event.title,
      ticketType: ticket.ticketType.name,
      attendeeName:
        ticket.holderName ?? `${ticket.order.user.firstName} ${ticket.order.user.lastName}`,
      scannedAt: ticket.scannedAt,
    };

    if (ticket.status === 'CANCELLED' || ticket.status === 'REFUNDED') {
      return respond(ticket.status, `Ticket is ${ticket.status.toLowerCase()}`, summary);
    }

    // Conditional update so two scanners cannot admit the same ticket twice.
    const scannedAt = new Date();
    const admitted = await prisma.$transaction(async (tx) => {
      const updated = await tx.ticket.updateMany({
        where: { id: ticket.id, status: 'VALID' },
        data: { status: 'USED', scannedAt },
      });
      if (updated.count === 0) return false;
      await tx.checkIn.create({
        data: {
          ticketId: ticket.id,
          scannedBy: scanner.id,
          location: dto.location,
          deviceInfo: dto.deviceInfo,
        },
      });
      return true;
    });

    if (!admitted) {
      const current = await prisma.ticket.findUnique({ where: { id: ticket.id } });
      return respond('ALREADY_USED', 'Ticket was already scanned', {
        ...summary,
        scannedAt: current?.scannedAt ?? ticket.scannedAt,
      });
    }

    return respond('VALID', 'Welcome in!', { ...summary, scannedAt });
  }

  async getUserTickets(userId: string) {
    const tickets = await prisma.ticket.findMany({
      where: {
        order: { userId, status: 'COMPLETED' },
      },
      include: ticketInclude,
      orderBy: {
        event: { startDate: 'asc' },
      },
    });

    return this.withQrImages(tickets);
  }

  async getTicketById(userId: string, ticketId: string) {
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, order: { userId } },
      include: ticketInclude,
    });
    if (!ticket) {
      throw notFound('Ticket not found');
    }
    const [withImage] = await this.withQrImages([ticket]);
    return withImage;
  }
}
