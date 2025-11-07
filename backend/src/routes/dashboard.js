// src/routes/dashboard.js
const router = require('express').Router();
const Timetable = require('../models/Timetable');
const Notification = require('../models/Notification');

/**
 * GET /api/dashboard
 * Returns the logged‑in student's timetable for today
 * plus the unread notifications (alerts).
 *
 * Protected route – `protect` middleware is applied in index.js,
 * so `req.user` is guaranteed to contain the authenticated user.
 */
router.get('/', async (req, res, next) => {
  try {
    // ---- 1️⃣ Get today's date (midnight) ----
    const today = new Date();
    const isoDate = today.toISOString().split('T')[0]; // “YYYY‑MM‑DD”

    // ---- 2️⃣ Fetch timetable for this student on today ----
    const schedule = await Timetable.findOne({
      userId: req.user.userId,
      date: new Date(isoDate),
    }).lean();

    // ---- 3️⃣ Fetch up to 5 unread alerts for the student ----
    const alerts = await Notification.find({
      userId: req.user.userId,
      read: false,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // ---- 4️⃣ Respond ----
    res.json({ schedule, alerts });
  } catch (err) {
    next(err);
  }
});

module.exports = router;