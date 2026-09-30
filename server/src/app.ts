import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';
import env from './config/env';
import swaggerSpec from './config/swagger';
import prisma from './config/database';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { TicketController } from './controllers/ticket.controller';
import { asyncHandler } from './utils/AppError';
import logger from './config/logger';

const app: Application = express();

// Behind nginx / a load balancer, so req.ip is the real client IP.
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '300'),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many login attempts, please try again later.' },
});

app.use(helmet());
// Native mobile apps send no Origin header, so CORS only affects browser clients.
app.use(cors({
  origin: env.corsOrigins,
  credentials: true,
}));

// Stripe signs the raw body, so the webhook must be registered before express.json().
const ticketController = new TicketController();
app.post(
  '/api/v1/payments/webhook',
  express.raw({ type: 'application/json' }),
  asyncHandler(ticketController.stripeWebhook.bind(ticketController))
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.isProduction ? 'combined' : 'dev', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
}));

const health = async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'up', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error', database: 'down', timestamp: new Date().toISOString() });
  }
};

app.get('/health', health);
app.get('/api/v1/health', health);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);
app.use('/api/v1', limiter);
app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
