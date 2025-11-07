// src/routes/admin.js
const router = require('express').Router();
const { requireRole } = require('../middleware/roleCheck');
const EngagementLog = require('../models/EngagementLog');
const User = require('../models/User');
const MentorMatch = require('../models/MentorMatch');
const CheckIn = require('../models/CheckIn');
const Notification = require('../models/Notification');
const LeisureHourRequest = require('../models/LeisureHourRequest');

/* ---------- Helper: 30‑day window ---------- */
function thirtyDaysAgo() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d;
}

/* ---------- Overall stats (events & active users) ---------- */
router.get('/stats', requireRole('admin'), async (req, res, next) => {
  try {
    const since = thirtyDaysAgo();
    const totalEvents = await EngagementLog.countDocuments({ timestamp: { $gte: since } });
    const activeUsers = await EngagementLog.distinct('userId', { timestamp: { $gte: since } });

    res.json({
      period: 'last 30 days',
      totalEvents,
      activeUsers: activeUsers.length,
    });
  } catch (e) {
    next(e);
  }
});

/* ---------- Users with low engagement (<5 events) ---------- */
router.get('/low-engagers', requireRole('admin'), async (req, res, next) => {
  try {
    const since = thirtyDaysAgo();
    const low = await EngagementLog.aggregate([
      { $match: { timestamp: { $gte: since } } },
      { $group: { _id: '$userId', cnt: { $sum: 1 } } },
      { $match: { cnt: { $lt: 5 } } },
    ]);

    const ids = low.map(l => l._id);
    const users = await User.find({ userId: { $in: ids }, role: 'student' })
      .select('userId name profile')
      .lean();

    res.json({ lowEngagers: users });
  } catch (e) {
    next(e);
  }
});

/* ---------- Mentor‑to‑student engagement report ---------- */
router.get('/mentor-engagement', requireRole('admin'), async (req, res, next) => {
  try {
    const activeMatches = await MentorMatch.find({ status: 'active' })
      .populate('mentor', 'userId name')
      .populate('student', 'userId name')
      .lean();

    const report = await Promise.all(
      activeMatches.map(async m => {
        const events = await EngagementLog.countDocuments({ userId: m.student.userId });
        return {
          mentorId: m.mentor.userId,
          mentorName: m.mentor.name,
          studentId: m.student.userId,
          studentName: m.student.name,
          events,
        };
      })
    );

    res.json({ mentorEngagement: report });
  } catch (e) {
    next(e);
  }
});

/* ---------- Manually assign mentor to student (admin only) ---------- */
router.post('/assign-mentor', requireRole('admin'), async (req, res, next) => {
  try {
    const { studentId, mentorId } = req.body;
    
    const student = await User.findOne({ userId: studentId, role: 'student' });
    const mentor = await User.findOne({ userId: mentorId, role: 'mentor' });
    
    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });

    // Check if already assigned
    const existing = await MentorMatch.findOne({ student: student._id, status: 'active' });
    if (existing) {
      existing.mentor = mentor._id;
      await existing.save();
    } else {
      await MentorMatch.create({
        student: student._id,
        mentor: mentor._id,
        status: 'active'
      });
    }

    // Update student's mentor reference
    student.mentor = mentor._id;
    await student.save();

    // Notify both
    await Notification.create({
      userId: student.userId,
      title: 'Mentor Assigned',
      body: `${mentor.name} has been assigned as your mentor`,
      type: 'mentor'
    });

    await Notification.create({
      userId: mentor.userId,
      title: 'New Mentee Assigned',
      body: `${student.name} has been assigned to you`,
      type: 'mentor'
    });

    res.json({ message: 'Mentor assigned successfully' });
  } catch (e) {
    next(e);
  }
});

/* ---------- Get student performance report ---------- */
router.get('/student-performance/:studentId', requireRole('admin'), async (req, res, next) => {
  try {
    const student = await User.findOne({ userId: req.params.studentId, role: 'student' });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const [engagement, checkIns, assignments, sessions] = await Promise.all([
      EngagementLog.countDocuments({ userId: student.userId }),
      CheckIn.countDocuments({ userId: student.userId }),
      require('../models/Assignment').countDocuments({ 'submissions.student': student._id }),
      require('../models/MentorSession').countDocuments({ student: student._id, status: 'completed' })
    ]);

    res.json({
      student: {
        userId: student.userId,
        name: student.name,
        profile: student.profile
      },
      performance: {
        totalEngagements: engagement,
        totalCheckIns: checkIns,
        assignmentsSubmitted: assignments,
        sessionsCompleted: sessions
      }
    });
  } catch (e) {
    next(e);
  }
});

/* ---------- Get all pending account deletion requests ---------- */
router.get('/deletion-requests', requireRole('admin'), async (req, res, next) => {
  try {
    const users = await User.find({ 
      isActive: false,
      deletedAt: { $exists: true }
    })
      .select('userId name email role profile deletedAt')
      .lean();
    
    res.json({ users });
  } catch (e) {
    next(e);
  }
});

/* ---------- Get all users by role ---------- */
router.get('/users', requireRole('admin'), async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = {};
    if (role) query.role = role;
    
    const users = await User.find(query)
      .select('userId name email role profile isActive deletedAt')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({ users });
  } catch (e) {
    next(e);
  }
});

/* ---------- Send notification to all users (admin only) ---------- */
router.post('/send-notification', requireRole('admin'), async (req, res, next) => {
  try {
    const { title, body, type = 'general', targetRole } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    // Determine target users
    let targetUsers;
    if (targetRole) {
      targetUsers = await User.find({ role: targetRole, isActive: { $ne: false }, deletedAt: null });
    } else {
      // Send to all active users
      targetUsers = await User.find({ isActive: { $ne: false }, deletedAt: null });
    }

    // Create notifications for all target users
    const notifications = targetUsers.map(user => ({
      userId: user.userId,
      title,
      body,
      type
    }));

    await Notification.insertMany(notifications);

    res.json({ 
      message: `Notification sent to ${targetUsers.length} user(s)`,
      count: targetUsers.length
    });
  } catch (e) {
    next(e);
  }
});

/* ---------- Get leisure hour requests (admin only) ---------- */
router.get('/leisure-requests', requireRole('admin'), async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const requests = await LeisureHourRequest.find(query)
      .populate('mentor', 'userId name profile')
      .sort({ date: 1 })
      .lean();

    res.json({ requests });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
