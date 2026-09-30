import { z } from 'zod';

const email = z.string().trim().toLowerCase().email('Invalid email address');
const isoDate = z.string().datetime({ offset: true, message: 'Must be an ISO 8601 date' });

export const registerSchema = z.object({
  email,
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(30).optional(),
  // ADMIN can never be self-assigned.
  role: z.enum(['CUSTOMER', 'HOST']).default('CUSTOMER'),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'refreshToken is required'),
});

const ticketTypeSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    description: z.string().max(500).optional(),
    price: z.number().min(0).max(100000),
    quantity: z.number().int().min(1).max(100000),
    minPerOrder: z.number().int().min(1).default(1),
    maxPerOrder: z.number().int().min(1).max(50).default(10),
    salesStartDate: isoDate.optional(),
    salesEndDate: isoDate.optional(),
  })
  .refine((t) => t.minPerOrder <= t.maxPerOrder, {
    message: 'minPerOrder must not exceed maxPerOrder',
    path: ['minPerOrder'],
  });

const eventFields = {
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(1).max(10000),
  category: z.string().trim().min(1).max(50),
  location: z.string().trim().min(1).max(200),
  venue: z.string().max(200).optional(),
  address: z.string().max(300).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  startDate: isoDate,
  endDate: isoDate,
  coverImage: z.string().url().optional(),
  images: z.array(z.string().url()).max(20).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  totalCapacity: z.number().int().min(1).optional(),
};

const endAfterStart = (e: { startDate?: string; endDate?: string }) =>
  !e.startDate || !e.endDate || new Date(e.endDate) > new Date(e.startDate);

export const createEventSchema = z
  .object({
    ...eventFields,
    status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
    ticketTypes: z.array(ticketTypeSchema).min(1, 'At least one ticket type is required').max(20),
  })
  .refine(endAfterStart, { message: 'endDate must be after startDate', path: ['endDate'] });

export const updateEventSchema = z
  .object({
    ...eventFields,
    status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']),
  })
  .partial()
  .refine(endAfterStart, { message: 'endDate must be after startDate', path: ['endDate'] });

export const purchaseSchema = z.object({
  eventId: z.string().uuid(),
  tickets: z
    .array(
      z.object({
        ticketTypeId: z.string().uuid(),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .min(1)
    .max(20),
  holderName: z.string().trim().max(200).optional(),
  holderEmail: email.optional(),
});

export const confirmPaymentSchema = z.object({
  paymentIntentId: z.string().min(1),
});

export const scanSchema = z.object({
  qrCode: z.string().trim().min(1).max(500),
  eventId: z.string().uuid().optional(),
  location: z.string().max(200).optional(),
  deviceInfo: z.string().max(200).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type PurchaseInput = z.infer<typeof purchaseSchema>;
export type ScanInput = z.infer<typeof scanSchema>;
