export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum TicketStatus {
  VALID = 'VALID',
  USED = 'USED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export interface Order {
  id: string;
  userId: string;
  eventId: string;
  totalAmount: number;
  serviceFee: number;
  platformFee: number;
  status: OrderStatus;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  orderId: string;
  eventId: string;
  ticketTypeId: string;
  qrCode: string;
  status: TicketStatus;
  holderName?: string;
  holderEmail?: string;
  scannedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripePaymentId?: string;
  paymentMethod?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}
