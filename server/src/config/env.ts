import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const isPlaceholder = (value?: string) =>
  !value || /your[_-]|change-this/i.test(value);

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  QR_SECRET_KEY: z.string().min(16, 'QR_SECRET_KEY must be at least 16 characters'),
  BCRYPT_ROUNDS: z.coerce.number().default(10),
  CORS_ORIGIN: z.string().optional(),
  CLIENT_URL: z.string().optional(),
  ADMIN_URL: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  CURRENCY: z.string().default('pln'),
  // "mock" confirms payments without Stripe so the mobile app can be tested end to end.
  PAYMENTS_MODE: z.enum(['stripe', 'mock']).optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`);
  // eslint-disable-next-line no-console
  console.error(`Invalid environment configuration:\n${issues.join('\n')}`);
  process.exit(1);
}

const raw = parsed.data;

const stripeConfigured = !isPlaceholder(raw.STRIPE_SECRET_KEY);

export const env = {
  ...raw,
  isProduction: raw.NODE_ENV === 'production',
  stripeConfigured,
  paymentsMode: raw.PAYMENTS_MODE ?? (stripeConfigured ? 'stripe' : 'mock'),
  corsOrigins: [
    ...(raw.CORS_ORIGIN?.split(',') ?? []),
    raw.CLIENT_URL,
    raw.ADMIN_URL,
  ]
    .map((o) => o?.trim())
    .filter((o): o is string => !!o),
};

export default env;
