// src/routes/booking.js
const router = require('express').Router();
const ResourceBooking = require('../models/ResourceBooking');

/* ---------- Create a new booking ---------- */
router.post('/', async (req, res, next) => {
  try {
    const { resource, date, from, to } = req.body; // date = ISO string (e.g., "2025-11-10")
    const booking = await ResourceBooking.create({
      userId: req.user.userId,
      resource,
      date,
      from,
      to,
      status: 'confirmed',
    });
    res.status(201).json({ booking });
  } catch (e) {
    if (e.code === 11000) {
      // duplicate (resource already booked for that slot)
      return res.status(409).json({ message: 'Slot already taken' });
    }
    next(e);
  }
});

/* ---------- List upcoming bookings for the logged‑in user ---------- */
router.get('/my', async (req, res, next) => {
  try {
    const today = new Date();
    const bookings = await ResourceBooking.find({
      userId: req.user.userId,
      date: { $gte: today },
    })
      .sort({ date: 1, from: 1 })
      .lean();

    res.json({ bookings });
  } catch (e) {
    next(e);
  }
});

/* ---------- Cancel a booking ---------- */
router.patch('/:id/cancel', async (req, res, next) => {
  try {
    const booking = await ResourceBooking.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (e) {
    next(e);
  }
});

module.exports = router;