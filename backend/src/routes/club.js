const router = require('express').Router();
const Club = require('../models/Club');
const Notification = require('../models/Notification');
const User = require('../models/User');

/* ---------- Get all clubs ---------- */
router.get('/', async (req, res, next) => {
  try {
    const clubs = await Club.find({ status: 'active' })
      .populate('president', 'userId name profile')
      .select('-members')
      .lean();
    res.json({ clubs });
  } catch (e) {
    next(e);
  }
});

/* ---------- Get club details ---------- */
router.get('/:id', async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('president', 'userId name profile')
      .populate('members', 'userId name profile')
      .lean();
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json({ club });
  } catch (e) {
    next(e);
  }
});

/* ---------- Join a club (students only) ---------- */
router.post('/:id/join', async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can join clubs' });
    }

    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    if (club.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a member' });
    }

    club.members.push(req.user._id);
    await club.save();

    // Create notification
    await Notification.create({
      userId: req.user.userId,
      title: `Joined ${club.name}`,
      body: `You have successfully joined ${club.name}`,
      type: 'club'
    });

    res.json({ message: 'Successfully joined club', club });
  } catch (e) {
    next(e);
  }
});

/* ---------- Leave a club ---------- */
router.post('/:id/leave', async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    club.members = club.members.filter(
      id => id.toString() !== req.user._id.toString()
    );
    await club.save();

    res.json({ message: 'Successfully left club' });
  } catch (e) {
    next(e);
  }
});

/* ---------- Get my clubs ---------- */
router.get('/my/memberships', async (req, res, next) => {
  try {
    const clubs = await Club.find({ members: req.user._id })
      .populate('president', 'userId name')
      .lean();
    res.json({ clubs });
  } catch (e) {
    next(e);
  }
});

/* ---------- Create club (admin only) ---------- */
router.post('/', async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create clubs' });
    }

    const { name, description, category, presidentId, meetingSchedule } = req.body;
    const club = await Club.create({
      name,
      description,
      category,
      president: presidentId,
      meetingSchedule
    });

    res.status(201).json({ club });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ message: 'Club name already exists' });
    }
    next(e);
  }
});

module.exports = router;

