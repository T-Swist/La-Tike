import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { authenticate, authorize } from '../middleware/auth';

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
  ticketController.purchaseTickets.bind(ticketController)
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
  ticketController.confirmPayment.bind(ticketController)
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
  ticketController.scanTicket.bind(ticketController)
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
  ticketController.getUserTickets.bind(ticketController)
);

export default router;
