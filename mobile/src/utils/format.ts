import config from '../config/env';

export const formatPrice = (amount: number): string =>
  amount === 0 ? 'Free' : `${Number(amount.toFixed(2)).toLocaleString()} ${config.CURRENCY}`;

export const formatDate = (iso: string, options?: Intl.DateTimeFormatOptions): string =>
  new Date(iso).toLocaleDateString('en-US', options ?? { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

export const formatTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
