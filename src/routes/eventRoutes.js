const express = require('express');
const { body } = require('express-validator');
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// ── Validation Rules ─────────────────────────────────────────────────────────

const createEventValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Event title is required.')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters.'),
  body('description')
    .trim()
    .notEmpty().withMessage('Event description is required.')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters.'),
  body('location')
    .trim()
    .notEmpty().withMessage('Event location is required.'),
  body('date')
    .notEmpty().withMessage('Event date is required.')
    .isISO8601().withMessage('Date must be a valid ISO 8601 date (e.g. 2025-12-31T18:00:00Z).')
    .toDate(),
  body('capacity')
    .notEmpty().withMessage('Event capacity is required.')
    .isInt({ min: 1 }).withMessage('Capacity must be a positive integer.'),
];

const updateEventValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters.'),
  body('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid ISO 8601 date.')
    .toDate(),
  body('capacity')
    .optional()
    .isInt({ min: 1 }).withMessage('Capacity must be a positive integer.'),
];

// ── Routes ───────────────────────────────────────────────────────────────────

router
  .route('/')
  .get(getAllEvents)                                        // Public
  .post(protect, authorize('admin'), createEventValidation, createEvent);  // Admin only

router
  .route('/:id')
  .get(getEventById)                                       // Public
  .put(protect, authorize('admin'), updateEventValidation, updateEvent)    // Admin only
  .delete(protect, authorize('admin'), deleteEvent);       // Admin only

module.exports = router;
