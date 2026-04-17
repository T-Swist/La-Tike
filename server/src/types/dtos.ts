export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'CUSTOMER' | 'HOST';
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateEventDTO {
  title: string;
  description: string;
  category: string;
  location: string;
  venue?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  startDate: string;
  endDate: string;
  coverImage?: string;
  images?: string[];
  tags?: string[];
  ticketTypes: CreateTicketTypeDTO[];
}

export interface UpdateEventDTO {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  venue?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  startDate?: string;
  endDate?: string;
  coverImage?: string;
  images?: string[];
  status?: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  tags?: string[];
}

export interface CreateTicketTypeDTO {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  minPerOrder?: number;
  maxPerOrder?: number;
  salesStartDate?: string;
  salesEndDate?: string;
}

export interface UpdateTicketTypeDTO {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  minPerOrder?: number;
  maxPerOrder?: number;
  salesStartDate?: string;
  salesEndDate?: string;
  isActive?: boolean;
}

export interface PurchaseTicketDTO {
  eventId: string;
  tickets: {
    ticketTypeId: string;
    quantity: number;
  }[];
  holderName?: string;
  holderEmail?: string;
}

export interface ScanTicketDTO {
  qrCode: string;
  location?: string;
  deviceInfo?: string;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImage?: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface RefundOrderDTO {
  orderId: string;
  reason?: string;
}
