import env from './config/env';
import app from './app';
import logger from './config/logger';
import prisma from './config/database';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server running on port ${env.PORT}`);
  logger.info(`📚 API Documentation: http://localhost:${env.PORT}/api-docs`);
  logger.info(`🏥 Health Check: http://localhost:${env.PORT}/api/v1/health`);
  logger.info(`🌍 Environment: ${env.NODE_ENV}`);
  logger.info(`💳 Payments mode: ${env.paymentsMode}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(
      `Port ${env.PORT} is already in use. If the Docker API is running, stop it with ` +
        '"docker compose stop server" or set a different PORT in server/.env.'
    );
  } else {
    logger.error('Server failed to start', { message: error.message });
  }
  process.exit(1);
});

const shutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  // Force exit if connections do not drain in time.
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', { reason });
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { message: error.message, stack: error.stack });
  process.exit(1);
});
