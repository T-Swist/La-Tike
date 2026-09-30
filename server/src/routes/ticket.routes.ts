import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/AppError';
import { purchaseSchema, confirmPaymentSchema, scanSchema } from '../validators';

const router = Router();
const ticketController = new TicketController();

/**
 * @swagger
 * /tickets/purchase:
 *   post:
 *     summary: Purchase tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/purchase',
  authenticate,
  validate(purchaseSchema),
  asyncHandler(ticketController.purchaseTickets.bind(ticketController))
);

/**
 * @swagger
 * /tickets/confirm-payment:
 *   post:
 *     summary: Confirm payment
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/confirm-payment',
  authenticate,
  validate(confirmPaymentSchema),
  asyncHandler(ticketController.confirmPayment.bind(ticketController))
);

/**
 * @swagger
 * /tickets/scan:
 *   post:
 *     summary: Scan ticket QR code
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/scan',
  authenticate,
  authorize('HOST', 'ADMIN'),
  validate(scanSchema),
  asyncHandler(ticketController.scanTicket.bind(ticketController))
);

/**
 * @swagger
 * /tickets/my-tickets:
 *   get:
 *     summary: Get user's tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/my-tickets',
  authenticate,
  asyncHandler(ticketController.getUserTickets.bind(ticketController))
);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get one of the current user's tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/:id',
  authenticate,
  asyncHandler(ticketController.getTicketById.bind(ticketController))
);

export default router;
