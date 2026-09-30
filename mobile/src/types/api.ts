// Shapes returned by the La-Tike API (server/src/services).

export type UserRole = 'CUSTOMER' | 'HOST' | 'ADMIN';
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
export type TicketStatus = 'VALID' | 'USED' | 'CANCELLED' | 'REFUNDED';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: UserRole;
}

export interface AuthPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface TicketType {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  quantity: number;
  sold: number;
  minPerOrder: number;
  maxPerOrder: number;
  isActive: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  venue?: string | null;
  address?: string | null;
  city?: string | null;
  startDate: string;
  endDate: string;
  coverImage?: string | null;
  status: EventStatus;
  isFeatured: boolean;
  tags: string[];
  ticketTypes: TicketType[];
  host?: { id: string; firstName: string; lastName: string; profileImage?: string | null };
}

export interface HostEvent extends Event {
  stats: {
    ticketsSold: number;
    totalTickets: number;
    checkedIn: number;
    revenue: number;
    feesCollected: number;
  };
}

export interface Ticket {
  id: string;
  orderId: string;
  qrCode: string;
  qrImage: string;
  status: TicketStatus;
  holderName?: string | null;
  scannedAt?: string | null;
  createdAt: string;
  ticketType: { id: string; name: string; price: number };
  event: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    location: string;
    venue?: string | null;
    address?: string | null;
    coverImage?: string | null;
    status: EventStatus;
  };
}

export interface PurchaseRequest {
  eventId: string;
  tickets: { ticketTypeId: string; quantity: number }[];
}

export interface PurchaseResponse {
  order: { id: string; totalAmount: number; status: string };
  requiresPayment: boolean;
  paymentMode?: 'stripe' | 'mock';
  paymentIntentId?: string;
  clientSecret?: string | null;
  tickets?: Ticket[];
}

export interface ConfirmPaymentResponse {
  success: boolean;
  status?: string;
  tickets?: Ticket[];
}

export type ScanResultCode =
  | 'VALID'
  | 'ALREADY_USED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'INVALID'
  | 'NOT_YOUR_EVENT'
  | 'WRONG_EVENT';

export interface ScanResponse {
  result: ScanResultCode;
  valid: boolean;
  message: string;
  ticket?: {
    id: string;
    eventTitle: string;
    ticketType: string;
    attendeeName: string;
    scannedAt?: string | null;
  };
}
