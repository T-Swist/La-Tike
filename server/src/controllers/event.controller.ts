import { Response } from 'express';
import { AuthRequest } from '../types';
import { EventService } from '../services/event.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';

const eventService = new EventService();

export class EventController {
  async createEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const event = await eventService.createEvent(req.user!.id, req.body);
      sendSuccess(res, event, 'Event created successfully', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getEvents(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { category, status, search, page, limit } = req.query;
      const result = await eventService.getEvents({
        category: category as string,
        status: status as string,
        search: search as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });
      sendPaginated(res, result.events, result.page, result.limit, result.total);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getEventById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const event = await eventService.getEventById(req.params.id);
      sendSuccess(res, event, 'Event retrieved');
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }

  async updateEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const event = await eventService.updateEvent(req.params.id, req.user!.id, req.body);
      sendSuccess(res, event, 'Event updated successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async deleteEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      await eventService.deleteEvent(req.params.id, req.user!.id);
      sendSuccess(res, null, 'Event deleted successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async uploadImage(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        sendError(res, 'No file uploaded', 400);
        return;
      }
      const imageUrl = await eventService.uploadImage(req.file);
      sendSuccess(res, { url: imageUrl }, 'Image uploaded successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
