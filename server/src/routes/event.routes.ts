import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';

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
router.get('/', eventController.getEvents.bind(eventController));

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
router.get('/:id', eventController.getEventById.bind(eventController));

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
  eventController.createEvent.bind(eventController)
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
  eventController.updateEvent.bind(eventController)
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
  eventController.deleteEvent.bind(eventController)
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
  eventController.uploadImage.bind(eventController)
);

export default router;
