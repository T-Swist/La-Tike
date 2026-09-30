import { Request, Response } from 'express';
import Stripe from 'stripe';
import { AuthRequest } from '../types';
import { TicketService } from '../services/ticket.service';
import { sendSuccess, sendError } from '../utils/response';
import { getStripe } from '../config/stripe';
import env from '../config/env';
import logger from '../config/logger';

const ticketService = new TicketService();

export class TicketController {
  async purchaseTickets(req: AuthRequest, res: Response): Promise<void> {
    const result = await ticketService.purchaseTickets(req.user!.id, req.body);
    sendSuccess(res, result, 'Order created successfully', 201);
  }

  async confirmPayment(req: AuthRequest, res: Response): Promise<void> {
    const result = await ticketService.confirmPayment(req.user!.id, req.body.paymentIntentId);
    sendSuccess(res, result, result.success ? 'Payment confirmed' : 'Payment not completed yet');
  }

  async scanTicket(req: AuthRequest, res: Response): Promise<void> {
    const result = await ticketService.scanTicket(req.user!, req.body);
    sendSuccess(res, result, result.message);
  }

  async getUserTickets(req: AuthRequest, res: Response): Promise<void> {
    const tickets = await ticketService.getUserTickets(req.user!.id);
    sendSuccess(res, tickets, 'Tickets retrieved');
  }

  async getTicketById(req: AuthRequest, res: Response): Promise<void> {
    const ticket = await ticketService.getTicketById(req.user!.id, req.params.id);
    sendSuccess(res, ticket, 'Ticket retrieved');
  }

  // Needs the raw request body, so it is mounted before express.json() in app.ts.
  async stripeWebhook(req: Request, res: Response): Promise<void> {
    if (!env.stripeConfigured || !env.STRIPE_WEBHOOK_SECRET) {
      sendError(res, 'Stripe webhooks are not configured', 503);
      return;
    }

    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'] as string,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error: any) {
      logger.warn('Rejected Stripe webhook', { error: error.message });
      sendError(res, 'Invalid signature', 400);
      return;
    }

    if (event.type === 'payment_intent.succeeded') {
      await ticketService.handlePaymentSucceeded(event.data.object.id);
    }

    res.json({ received: true });
  }
}
