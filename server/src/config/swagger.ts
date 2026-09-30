import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'La-Tike Event Ticketing API',
      version: '1.0.0',
      description: 'API documentation for La-Tike event ticketing platform',
      contact: {
        name: 'API Support',
        email: 'support@latike.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api/v1`,
        description: 'Development server',
      },
      {
        url: 'https://api.latike.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Resolved from this file so it works both with ts-node (src) and the compiled build (dist).
  apis: [path.join(__dirname, '../routes/*.{ts,js}')],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
