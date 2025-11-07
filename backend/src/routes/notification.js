const router = require('express').Router();
const Notification = require('../models/Notification');
const User = require('../models/User');
const MentorMatch = require('../models/MentorMatch');
const { requireRole } = require('../middleware/roleCheck');

/* ---------- Utility helpers ---------- */
const buildTargetUsersQuery = ({ role, userIds }) => {
  const query = { isActive: { $ne: false }, deletedAt: null };
  if (role) {
    query.role = role;
  }
  if (userIds && userIds.length) {
    query.userId = { $in: userIds };
  }
  return query;
};

/* ---------- Fetch notifications for logged-in user ---------- */
router.get('/', async (req, res, next) => {
  try {
    const { status, type, limit = 50, skip = 0 } = req.query;
    const query = { userId: req.user.userId };

    if (status === 'unread') {
      query.read = false;
    }
    if (status === 'read') {
      query.read = true;
    }
    if (type) {
      query.type = type;
    }

    const [notifications, unreadCount, total] = await Promise.all([
      Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Math.min(Number(limit), 100))
      .lean(),
      Notification.countDocuments({ userId: req.user.userId, read: false }),
      Notification.countDocuments(query)
    ]);

    res.json({ notifications, unreadCount, total });
  } catch (err) {
    next(err);
  }
});

/* ---------- Mark a single notification as read ---------- */
router.patch('/:id/read', async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ notification });
  } catch (err) {
    next(err);
  }
});

/* ---------- Mark all notifications as read ---------- */
router.patch('/actions/mark-all-read', async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user.userId, read: false },
      { $set: { read: true } }
    );

    res.json({ updated: result.modifiedCount });
  } catch (err) {
    next(err);
  }
});

/* ---------- Admin: broadcast notification ---------- */
router.post('/broadcast', requireRole('admin'), async (req, res, next) => {
  try {
    const { title, body, type = 'general', targetRole, userIds = [] } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    const query = buildTargetUsersQuery({ role: targetRole, userIds });
    const recipients = await User.find(query).select('userId');

    if (!recipients.length) {
      return res.status(404).json({ message: 'No users matched the criteria' });
    }

    const payload = recipients.map((user) => ({
      userId: user.userId,
      title,
      body,
      type,
    }));

    await Notification.insertMany(payload);

    res.json({ message: `Notification sent to ${recipients.length} user(s)` });
  } catch (err) {
    next(err);
  }
});

/* ---------- Mentor: notify mentees ---------- */
router.post('/mentor-message', requireRole('mentor'), async (req, res, next) => {
  try {
    const { title, body, studentIds = [] } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    const matches = await MentorMatch.find({ mentor: req.user._id, status: 'active' })
      .populate('student', 'userId name');

    const mentees = matches
      .map((match) => match.student)
      .filter(Boolean);

    if (!mentees.length) {
      return res.status(400).json({ message: 'No active mentees to notify' });
    }

    const targetUserIds = studentIds.length
      ? mentees.filter((student) => studentIds.includes(student.userId)).map((student) => student.userId)
      : mentees.map((student) => student.userId);

    if (!targetUserIds.length) {
      return res.status(400).json({ message: 'Selected students are not your mentees' });
    }

    const notifications = targetUserIds.map((userId) => ({
      userId,
      title,
      body,
      type: 'mentor',
    }));

    await Notification.insertMany(notifications);

    res.json({ message: `Notification sent to ${targetUserIds.length} mentee(s)` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

