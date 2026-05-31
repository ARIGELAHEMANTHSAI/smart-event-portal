const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { asyncHandler } = require('../middleware/errorMiddleware');

// ─── Register for an Event ──────────────────────────────────────────────────
// POST /api/registrations/:eventId  (authenticated users)
const registerForEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found.',
    });
  }

  // Check capacity
  const registrationCount = await Registration.countDocuments({
    event: event._id,
  });

  if (registrationCount >= event.capacity) {
    return res.status(400).json({
      success: false,
      message: 'Event is fully booked. No spots remaining.',
    });
  }

  // Prevent duplicate registration (also enforced by compound index)
  const existing = await Registration.findOne({
    user: req.user._id,
    event: event._id,
  });

  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'You are already registered for this event.',
    });
  }

  const registration = await Registration.create({
    user: req.user._id,
    event: event._id,
  });

  await registration.populate([
    { path: 'user', select: 'name email' },
    { path: 'event', select: 'title date location capacity' },
  ]);

  res.status(201).json({
    success: true,
    message: 'Successfully registered for the event.',
    data: registration,
  });
});

// ─── Get My Registrations ───────────────────────────────────────────────────
// GET /api/registrations/my  (authenticated users)
const getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ user: req.user._id })
    .populate('event', 'title description location date capacity')
    .sort({ registeredAt: -1 });

  res.status(200).json({
    success: true,
    count: registrations.length,
    data: registrations,
  });
});

// ─── Get Registrations for an Event ────────────────────────────────────────
// GET /api/registrations/event/:eventId  (admin only)
const getEventRegistrations = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found.',
    });
  }

  const registrations = await Registration.find({ event: event._id })
    .populate('user', 'name email')
    .sort({ registeredAt: 1 });

  res.status(200).json({
    success: true,
    eventTitle: event.title,
    capacity: event.capacity,
    registered: registrations.length,
    spotsRemaining: event.capacity - registrations.length,
    data: registrations,
  });
});

module.exports = { registerForEvent, getMyRegistrations, getEventRegistrations };
