export const EVENT_CATEGORIES = [
  'Music',
  'Sports',
  'Arts',
  'Theater',
  'Comedy',
  'Conference',
  'Workshop',
  'Festival',
  'Networking',
  'Other',
] as const;

export const TICKET_STATUS_COLORS = {
  VALID: '#10B981',
  USED: '#6B7280',
  CANCELLED: '#EF4444',
  REFUNDED: '#F59E0B',
} as const;

export const ORDER_STATUS_COLORS = {
  PENDING: '#F59E0B',
  COMPLETED: '#10B981',
  FAILED: '#EF4444',
  REFUNDED: '#6B7280',
} as const;

export const EVENT_STATUS_COLORS = {
  DRAFT: '#6B7280',
  PUBLISHED: '#10B981',
  CANCELLED: '#EF4444',
  COMPLETED: '#3B82F6',
} as const;
