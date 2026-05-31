const { validationResult } = require('express-validator');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { asyncHandler } = require('../middleware/errorMiddleware');

// ─── Get All Events ─────────────────────────────────────────────────────────
// GET /api/events  (public)
const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find()
    .populate('createdBy', 'name email')
    .sort({ date: 1 });

  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
});

// ─── Get Single Event ───────────────────────────────────────────────────────
// GET /api/events/:id  (public)
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate(
    'createdBy',
    'name email'
  );

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found.',
    });
  }

  // Include current registration count
  const registrationCount = await Registration.countDocuments({
    event: event._id,
  });

  res.status(200).json({
    success: true,
    data: {
      ...event.toObject(),
      registrationCount,
      spotsRemaining: event.capacity - registrationCount,
    },
  });
});

// ─── Create Event ───────────────────────────────────────────────────────────
// POST /api/events  (admin only)
const createEvent = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, description, location, date, capacity } = req.body;

  const event = await Event.create({
    title,
    description,
    location,
    date,
    capacity,
    createdBy: req.user._id,
  });

  await event.populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Event created successfully.',
    data: event,
  });
});

// ─── Update Event ───────────────────────────────────────────────────────────
// PUT /api/events/:id  (admin only)
const updateEvent = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found.',
    });
  }

  // Prevent reducing capacity below existing registrations
  if (req.body.capacity) {
    const registrationCount = await Registration.countDocuments({
      event: event._id,
    });
    if (req.body.capacity < registrationCount) {
      return res.status(400).json({
        success: false,
        message: `Cannot reduce capacity below current registration count (${registrationCount}).`,
      });
    }
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('createdBy', 'name email');

  res.status(200).json({
    success: true,
    message: 'Event updated successfully.',
    data: updatedEvent,
  });
});

// ─── Delete Event ───────────────────────────────────────────────────────────
// DELETE /api/events/:id  (admin only)
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found.',
    });
  }

  // Remove all registrations linked to this event
  await Registration.deleteMany({ event: event._id });
  await event.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Event and all related registrations deleted successfully.',
    data: {},
  });
});

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
