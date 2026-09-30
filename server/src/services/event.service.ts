import { EventStatus, Prisma, UserRole } from '@prisma/client';
import prisma from '../config/database';
import { CreateEventInput, UpdateEventInput } from '../validators';
import cloudinary from '../config/cloudinary';
import { AuthUser } from '../types';
import { badRequest, conflict, forbidden, notFound } from '../utils/AppError';

const PUBLIC_STATUSES: EventStatus[] = ['PUBLISHED', 'COMPLETED'];

const canManage = (user: AuthUser, hostId: string) =>
  user.role === UserRole.ADMIN || user.id === hostId;

export class EventService {
  async createEvent(hostId: string, dto: CreateEventInput) {
    const event = await prisma.event.create({
      data: {
        hostId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        location: dto.location,
        venue: dto.venue,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        latitude: dto.latitude,
        longitude: dto.longitude,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        coverImage: dto.coverImage,
        images: dto.images || [],
        tags: dto.tags || [],
        status: dto.status,
        totalCapacity: dto.totalCapacity,
        ticketTypes: {
          create: dto.ticketTypes.map((tt) => ({
            name: tt.name,
            description: tt.description,
            price: tt.price,
            quantity: tt.quantity,
            minPerOrder: tt.minPerOrder,
            maxPerOrder: tt.maxPerOrder,
            salesStartDate: tt.salesStartDate ? new Date(tt.salesStartDate) : null,
            salesEndDate: tt.salesEndDate ? new Date(tt.salesEndDate) : null,
          })),
        },
      },
      include: {
        ticketTypes: true,
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return event;
  }

  async getEventById(eventId: string, viewer?: AuthUser) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        ticketTypes: { where: { isActive: true }, orderBy: { price: 'asc' } },
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });

    // Drafts and cancelled events are only visible to their host and admins.
    const isVisible =
      event && (PUBLIC_STATUSES.includes(event.status) || (viewer && canManage(viewer, event.hostId)));

    if (!event || !isVisible) {
      throw notFound('Event not found');
    }

    return event;
  }

  async getEvents(filters: {
    category?: string;
    status?: string;
    search?: string;
    upcoming?: boolean;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 20));
    const { category, status, search, upcoming } = filters;

    const statusFilter = PUBLIC_STATUSES.includes(status as EventStatus)
      ? (status as EventStatus)
      : 'PUBLISHED';

    const where: Prisma.EventWhereInput = { status: statusFilter };

    if (category) where.category = { equals: category, mode: 'insensitive' };
    if (upcoming) where.endDate = { gte: new Date() };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          ticketTypes: { where: { isActive: true }, orderBy: { price: 'asc' } },
          host: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { startDate: 'asc' }],
      }),
      prisma.event.count({ where }),
    ]);

    return { events, total, page, limit };
  }

  // Events owned by a host, with sales and check-in figures for the host dashboard.
  async getHostEvents(hostId: string) {
    const events = await prisma.event.findMany({
      where: { hostId },
      include: { ticketTypes: { orderBy: { price: 'asc' } } },
      orderBy: { startDate: 'desc' },
    });

    const eventIds = events.map((e) => e.id);
    const [checkedIn, revenue] = await Promise.all([
      prisma.ticket.groupBy({
        by: ['eventId'],
        where: { eventId: { in: eventIds }, status: 'USED' },
        _count: { _all: true },
      }),
      prisma.order.groupBy({
        by: ['eventId'],
        where: { eventId: { in: eventIds }, status: 'COMPLETED' },
        _sum: { totalAmount: true, serviceFee: true, platformFee: true },
      }),
    ]);

    return events.map((event) => {
      const ticketsSold = event.ticketTypes.reduce((sum, tt) => sum + tt.sold, 0);
      const totalTickets = event.ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0);
      const sums = revenue.find((r) => r.eventId === event.id)?._sum;
      const fees = (sums?.serviceFee ?? 0) + (sums?.platformFee ?? 0);
      return {
        ...event,
        stats: {
          ticketsSold,
          totalTickets,
          checkedIn: checkedIn.find((c) => c.eventId === event.id)?._count._all ?? 0,
          // What the host earns: ticket sales without the fees added on top for buyers
          revenue: Math.round(((sums?.totalAmount ?? 0) - fees) * 100) / 100,
          feesCollected: Math.round(fees * 100) / 100,
        },
      };
    });
  }

  async updateEvent(eventId: string, user: AuthUser, dto: UpdateEventInput) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw notFound('Event not found');
    }

    if (!canManage(user, event.hostId)) {
      throw forbidden('You can only edit your own events');
    }

    const startDate = dto.startDate ? new Date(dto.startDate) : event.startDate;
    const endDate = dto.endDate ? new Date(dto.endDate) : event.endDate;
    if (endDate <= startDate) {
      throw badRequest('endDate must be after startDate');
    }

    const { startDate: _s, endDate: _e, ...rest } = dto;

    return prisma.event.update({
      where: { id: eventId },
      data: { ...rest, startDate, endDate },
      include: {
        ticketTypes: true,
      },
    });
  }

  async deleteEvent(eventId: string, user: AuthUser) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { tickets: true } } },
    });

    if (!event) {
      throw notFound('Event not found');
    }

    if (!canManage(user, event.hostId)) {
      throw forbidden('You can only delete your own events');
    }

    if (event._count.tickets > 0) {
      throw conflict('This event has sold tickets. Cancel it instead of deleting it.');
    }

    await prisma.event.delete({
      where: { id: eventId },
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'latike/events',
          transformation: [{ width: 1200, height: 630, crop: 'limit' }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        }
      );

      uploadStream.end(file.buffer);
    });
  }
}
