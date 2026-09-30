import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/AppError';
import { createEventSchema, updateEventSchema } from '../validators';

const router = Router();
const eventController = new EventController();

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 */
router.get('/', asyncHandler(eventController.getEvents.bind(eventController)));

/**
 * @swagger
 * /events/my-events:
 *   get:
 *     summary: Get the current host's events with sales stats
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/my-events',
  authenticate,
  authorize('HOST', 'ADMIN'),
  asyncHandler(eventController.getMyEvents.bind(eventController))
);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id', optionalAuth, asyncHandler(eventController.getEventById.bind(eventController)));

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/',
  authenticate,
  authorize('HOST', 'ADMIN'),
  validate(createEventSchema),
  asyncHandler(eventController.createEvent.bind(eventController))
);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  '/:id',
  authenticate,
  authorize('HOST', 'ADMIN'),
  validate(updateEventSchema),
  asyncHandler(eventController.updateEvent.bind(eventController))
);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  '/:id',
  authenticate,
  authorize('HOST', 'ADMIN'),
  asyncHandler(eventController.deleteEvent.bind(eventController))
);

/**
 * @swagger
 * /events/upload/image:
 *   post:
 *     summary: Upload event image
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/upload/image',
  authenticate,
  authorize('HOST', 'ADMIN'),
  upload.single('image'),
  asyncHandler(eventController.uploadImage.bind(eventController))
);

export default router;
