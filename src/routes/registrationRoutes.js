const express = require('express');
const {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// All registration routes require authentication
router.use(protect);

router.post('/:eventId', registerForEvent);             // Any authenticated user
router.get('/my', getMyRegistrations);                  // Any authenticated user
router.get('/event/:eventId', authorize('admin'), getEventRegistrations); // Admin only

module.exports = router;
