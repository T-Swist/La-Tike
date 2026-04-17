export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface Event {
  id: string;
  hostId: string;
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
  images: string[];
  status: EventStatus;
  isFeatured: boolean;
  totalCapacity?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  sold: number;
  minPerOrder: number;
  maxPerOrder: number;
  salesStartDate?: string;
  salesEndDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventWithTickets extends Event {
  ticketTypes: TicketType[];
  host: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
}
