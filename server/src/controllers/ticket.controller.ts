import { Response } from 'express';
import { AuthRequest } from '../types';
import { TicketService } from '../services/ticket.service';
import { sendSuccess, sendError } from '../utils/response';

const ticketService = new TicketService();

export class TicketController {
  async purchaseTickets(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await ticketService.purchaseTickets(req.user!.id, req.body);
      sendSuccess(res, result, 'Order created successfully', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async confirmPayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { paymentIntentId } = req.body;
      const result = await ticketService.confirmPayment(paymentIntentId);
      sendSuccess(res, result, 'Payment confirmed');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async scanTicket(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await ticketService.scanTicket(req.user!.id, req.body);
      sendSuccess(res, result, 'Ticket scanned successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getUserTickets(req: AuthRequest, res: Response): Promise<void> {
    try {
      const tickets = await ticketService.getUserTickets(req.user!.id);
      sendSuccess(res, tickets, 'Tickets retrieved');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
