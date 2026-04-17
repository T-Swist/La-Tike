import prisma from '../config/database';
import { PurchaseTicketDTO, ScanTicketDTO } from '../types/dtos';
import { generateQRCodeData, verifyQRCode, generateQRCodeImage } from '../utils/qrcode';
import { sendTicketEmail } from '../utils/email';
import stripe from '../config/stripe';

export class TicketService {
  async purchaseTickets(userId: string, dto: PurchaseTicketDTO) {
    const event = await prisma.event.findUnique({
      where: { id: dto.eventId },
      include: { ticketTypes: true },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.status !== 'PUBLISHED') {
      throw new Error('Event is not available for ticket purchase');
    }

    let totalAmount = 0;
    const ticketItems: any[] = [];

    for (const item of dto.tickets) {
      const ticketType = event.ticketTypes.find((tt) => tt.id === item.ticketTypeId);

      if (!ticketType) {
        throw new Error(`Ticket type ${item.ticketTypeId} not found`);
      }

      if (!ticketType.isActive) {
        throw new Error(`Ticket type ${ticketType.name} is not available`);
      }

      const availableTickets = ticketType.quantity - ticketType.sold;
      if (availableTickets < item.quantity) {
        throw new Error(`Not enough tickets available for ${ticketType.name}`);
      }

      if (item.quantity < ticketType.minPerOrder || item.quantity > ticketType.maxPerOrder) {
        throw new Error(
          `Quantity for ${ticketType.name} must be between ${ticketType.minPerOrder} and ${ticketType.maxPerOrder}`
        );
      }

      totalAmount += ticketType.price * item.quantity;
      ticketItems.push({
        ticketType,
        quantity: item.quantity,
      });
    }

    const serviceFee = totalAmount * 0.05;
    const platformFee = totalAmount * 0.03;
    const finalAmount = totalAmount + serviceFee + platformFee;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount * 100),
      currency: 'usd',
      metadata: {
        userId,
        eventId: dto.eventId,
      },
    });

    const order = await prisma.order.create({
      data: {
        userId,
        eventId: dto.eventId,
        totalAmount: finalAmount,
        serviceFee,
        platformFee,
        status: 'PENDING',
      },
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: finalAmount,
        status: 'PENDING',
        stripePaymentIntent: paymentIntent.id,
      },
    });

    return {
      order,
      clientSecret: paymentIntent.client_secret,
    };
  }

  async confirmPayment(paymentIntentId: string) {
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentIntent: paymentIntentId },
      include: {
        order: {
          include: {
            event: {
              include: {
                ticketTypes: true,
              },
            },
            user: true,
          },
        },
      },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'SUCCEEDED',
            stripePaymentId: paymentIntent.id,
          },
        });

        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: 'COMPLETED' },
        });

        const ticketsData = JSON.parse(paymentIntent.metadata.tickets || '[]');
        const tickets = [];

        for (const item of ticketsData) {
          for (let i = 0; i < item.quantity; i++) {
            const qrData = generateQRCodeData(payment.orderId, payment.order.eventId);
            const qrImage = await generateQRCodeImage(qrData);

            const ticket = await tx.ticket.create({
              data: {
                orderId: payment.orderId,
                eventId: payment.order.eventId,
                ticketTypeId: item.ticketTypeId,
                qrCode: qrData,
                qrHash: qrData.split('-')[2],
                status: 'VALID',
              },
              include: {
                ticketType: true,
              },
            });

            tickets.push({
              ...ticket,
              qrImage,
            });

            await tx.ticketType.update({
              where: { id: item.ticketTypeId },
              data: { sold: { increment: 1 } },
            });
          }
        }

        await sendTicketEmail(
          payment.order.user.email,
          payment.order.event.title,
          tickets.map((t) => ({
            qrCode: t.qrImage,
            ticketType: t.ticketType.name,
          }))
        );
      });

      return { success: true };
    }

    return { success: false };
  }

  async scanTicket(scannerId: string, dto: ScanTicketDTO) {
    const qrVerification = verifyQRCode(dto.qrCode);

    if (!qrVerification.isValid) {
      throw new Error('Invalid QR code');
    }

    const ticket = await prisma.ticket.findUnique({
      where: { qrCode: dto.qrCode },
      include: {
        event: true,
        ticketType: true,
        order: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    if (ticket.status !== 'VALID') {
      throw new Error(`Ticket is ${ticket.status.toLowerCase()}`);
    }

    if (ticket.scannedAt) {
      throw new Error('Ticket already used');
    }

    const checkIn = await prisma.$transaction(async (tx) => {
      await tx.ticket.update({
        where: { id: ticket.id },
        data: {
          status: 'USED',
          scannedAt: new Date(),
        },
      });

      return await tx.checkIn.create({
        data: {
          ticketId: ticket.id,
          scannedBy: scannerId,
          location: dto.location,
          deviceInfo: dto.deviceInfo,
        },
      });
    });

    return {
      checkIn,
      ticket,
      attendee: ticket.order.user,
    };
  }

  async getUserTickets(userId: string) {
    const tickets = await prisma.ticket.findMany({
      where: {
        order: {
          userId,
        },
      },
      include: {
        event: true,
        ticketType: true,
        order: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tickets.map((ticket) => ({
      ...ticket,
      qrImage: generateQRCodeImage(ticket.qrCode),
    }));
  }
}
