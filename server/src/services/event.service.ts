import prisma from '../config/database';
import { CreateEventDTO, UpdateEventDTO } from '../types/dtos';
import cloudinary from '../config/cloudinary';

export class EventService {
  async createEvent(hostId: string, dto: CreateEventDTO) {
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
        ticketTypes: {
          create: dto.ticketTypes.map((tt) => ({
            name: tt.name,
            description: tt.description,
            price: tt.price,
            quantity: tt.quantity,
            minPerOrder: tt.minPerOrder || 1,
            maxPerOrder: tt.maxPerOrder || 10,
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

  async getEventById(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        ticketTypes: true,
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  }

  async getEvents(filters: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { category, status, search, page = 1, limit = 20 } = filters;

    const where: any = {};

    if (category) where.category = category;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          ticketTypes: true,
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
        orderBy: { startDate: 'asc' },
      }),
      prisma.event.count({ where }),
    ]);

    return { events, total, page, limit };
  }

  async updateEvent(eventId: string, hostId: string, dto: UpdateEventDTO) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.hostId !== hostId) {
      throw new Error('Unauthorized');
    }

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description && { description: dto.description }),
        ...(dto.category && { category: dto.category }),
        ...(dto.location && { location: dto.location }),
        ...(dto.venue && { venue: dto.venue }),
        ...(dto.address && { address: dto.address }),
        ...(dto.city && { city: dto.city }),
        ...(dto.state && { state: dto.state }),
        ...(dto.country && { country: dto.country }),
        ...(dto.latitude && { latitude: dto.latitude }),
        ...(dto.longitude && { longitude: dto.longitude }),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
        ...(dto.coverImage && { coverImage: dto.coverImage }),
        ...(dto.images && { images: dto.images }),
        ...(dto.status && { status: dto.status }),
        ...(dto.tags && { tags: dto.tags }),
      },
      include: {
        ticketTypes: true,
      },
    });

    return updated;
  }

  async deleteEvent(eventId: string, hostId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.hostId !== hostId) {
      throw new Error('Unauthorized');
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
