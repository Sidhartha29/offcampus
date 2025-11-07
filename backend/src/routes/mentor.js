// src/routes/mentor.js
const router = require('express').Router();
const MentorMatch = require('../models/MentorMatch');
const User = require('../models/User');

/* ---------- Student requests a mentor (simple random assignment) ---------- */
router.post('/request', async (req, res, next) => {
  try {
    if (req.user.role !== 'student')
      return res.status(403).json({ message: 'Only students can request mentors' });

    // Already has an active mentor?
    const existing = await MentorMatch.findOne({ student: req.user._id, status: 'active' });
    if (existing) {
      const mentor = await User.findById(existing.mentor);
      return res.json({
        message: 'Mentor already assigned',
        mentorId: mentor.userId,
        mentorName: mentor.name,
      });
    }

    // Pick a random available mentor
    const mentors = await User.find({ role: 'mentor' });
    if (!mentors.length) return res.status(404).json({ message: 'No mentors available' });

    const mentor = mentors[Math.floor(Math.random() * mentors.length)];
    const match = await MentorMatch.create({
      student: req.user._id,
      mentor: mentor._id,
      status: 'active',
    });

    // link back to the student document (optional)
    await User.findByIdAndUpdate(req.user._id, { mentor: mentor._id });

    res.json({
      message: 'Mentor assigned',
      mentorId: mentor.userId,
      mentorName: mentor.name,
    });
  } catch (e) {
    next(e);
  }
});

/* ---------- Mentor fetches his/her active mentees ---------- */
router.get('/my-mentees', async (req, res, next) => {
  try {
    if (req.user.role !== 'mentor')
      return res.status(403).json({ message: 'Only mentors can view mentees' });

    const matches = await MentorMatch.find({ mentor: req.user._id, status: 'active' })
      .populate('student', 'userId name profile')
      .lean();

    const mentees = matches.map(m => m.student);
    res.json({ mentees });
  } catch (e) {
    next(e);
  }
});

/* ---------- Student fetches their assigned mentor ---------- */
router.get('/my-mentor', async (req, res, next) => {
  try {
    if (req.user.role !== 'student')
      return res.status(403).json({ message: 'Only students can view their mentor' });

    const match = await MentorMatch.findOne({ student: req.user._id, status: 'active' })
      .populate('mentor', 'userId name profile email')
      .lean();

    if (!match || !match.mentor) {
      return res.json({ mentor: null, message: 'No mentor assigned' });
    }

    res.json({ mentor: match.mentor });
  } catch (e) {
    next(e);
  }
});

module.exports = router;