import { Response } from 'express';
import { AuthRequest } from '../types';
import { EventService } from '../services/event.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';

const eventService = new EventService();

export class EventController {
  async createEvent(req: AuthRequest, res: Response): Promise<void> {
    const event = await eventService.createEvent(req.user!.id, req.body);
    sendSuccess(res, event, 'Event created successfully', 201);
  }

  async getEvents(req: AuthRequest, res: Response): Promise<void> {
    const { category, status, search, upcoming, page, limit } = req.query;
    const result = await eventService.getEvents({
      category: category as string,
      status: status as string,
      search: search as string,
      upcoming: upcoming === 'true',
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    sendPaginated(res, result.events, result.page, result.limit, result.total);
  }

  async getMyEvents(req: AuthRequest, res: Response): Promise<void> {
    const events = await eventService.getHostEvents(req.user!.id);
    sendSuccess(res, events, 'Events retrieved');
  }

  async getEventById(req: AuthRequest, res: Response): Promise<void> {
    const event = await eventService.getEventById(req.params.id, req.user);
    sendSuccess(res, event, 'Event retrieved');
  }

  async updateEvent(req: AuthRequest, res: Response): Promise<void> {
    const event = await eventService.updateEvent(req.params.id, req.user!, req.body);
    sendSuccess(res, event, 'Event updated successfully');
  }

  async deleteEvent(req: AuthRequest, res: Response): Promise<void> {
    await eventService.deleteEvent(req.params.id, req.user!);
    sendSuccess(res, null, 'Event deleted successfully');
  }

  async uploadImage(req: AuthRequest, res: Response): Promise<void> {
    if (!req.file) {
      sendError(res, 'No file uploaded', 400);
      return;
    }
    const imageUrl = await eventService.uploadImage(req.file);
    sendSuccess(res, { url: imageUrl }, 'Image uploaded successfully');
  }
}
