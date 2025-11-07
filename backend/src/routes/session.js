const router = require('express').Router();
const MentorSession = require('../models/MentorSession');
const Notification = require('../models/Notification');
const User = require('../models/User');

/* ---------- Request mentor session (students only) ---------- */
router.post('/', async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can request sessions' });
    }

    const { mentorId, date, time, duration, topic, location } = req.body;
    
    // Check if student has a mentor assigned
    const student = await User.findById(req.user._id);
    if (!student.mentor || student.mentor.toString() !== mentorId) {
      return res.status(403).json({ message: 'Mentor not assigned to you' });
    }

    const session = await MentorSession.create({
      student: req.user._id,
      mentor: mentorId,
      date,
      time,
      duration: duration || 60,
      topic,
      location: location || 'Online',
      status: 'requested'
    });

    // Notify mentor
    const mentor = await User.findById(mentorId);
    if (mentor) {
      await Notification.create({
        userId: mentor.userId,
        title: 'New Session Request',
        body: `${req.user.name} requested a session on ${new Date(date).toLocaleDateString()} at ${time}${topic ? `. Topic: ${topic}` : ''}`,
        type: 'mentor'
      });
    }

    res.status(201).json({ session, message: 'Session request sent to mentor' });
  } catch (e) {
    next(e);
  }
});

/* ---------- Accept session request (mentor only) ---------- */
router.post('/:id/accept', async (req, res, next) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can accept session requests' });
    }

    const session = await MentorSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (session.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your session request' });
    }

    if (session.status !== 'requested') {
      return res.status(400).json({ message: 'Session request already processed' });
    }

    session.status = 'accepted';
    await session.save();

    // Notify student
    const student = await User.findById(session.student);
    if (student) {
      await Notification.create({
        userId: student.userId,
        title: 'Session Request Accepted',
        body: `Your session request with ${req.user.name} on ${new Date(session.date).toLocaleDateString()} at ${session.time} has been accepted`,
        type: 'mentor'
      });
    }

    res.json({ session, message: 'Session request accepted' });
  } catch (e) {
    next(e);
  }
});

/* ---------- Reject session request (mentor only) ---------- */
router.post('/:id/reject', async (req, res, next) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can reject session requests' });
    }

    const session = await MentorSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (session.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your session request' });
    }

    if (session.status !== 'requested') {
      return res.status(400).json({ message: 'Session request already processed' });
    }

    session.status = 'rejected';
    if (req.body.notes) {
      session.notes = req.body.notes;
    }
    await session.save();

    // Notify student
    const student = await User.findById(session.student);
    if (student) {
      await Notification.create({
        userId: student.userId,
        title: 'Session Request Rejected',
        body: `Your session request with ${req.user.name} on ${new Date(session.date).toLocaleDateString()} has been rejected${req.body.notes ? `. Reason: ${req.body.notes}` : ''}`,
        type: 'mentor'
      });
    }

    res.json({ session, message: 'Session request rejected' });
  } catch (e) {
    next(e);
  }
});

/* ---------- Get my sessions ---------- */
const fetchMySessions = async (req, res, next) => {
  try {
    let sessions;
    if (req.user.role === 'student') {
      sessions = await MentorSession.find({ student: req.user._id })
        .populate('mentor', 'userId name profile')
        .sort({ date: 1, time: 1 })
        .lean();
    } else if (req.user.role === 'mentor') {
      sessions = await MentorSession.find({ mentor: req.user._id })
        .populate('student', 'userId name profile')
        .sort({ date: 1, time: 1 })
        .lean();
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json({ sessions });
  } catch (e) {
    next(e);
  }
};

router.get('/', fetchMySessions);
router.get('/my', fetchMySessions);

/* ---------- Update session status (for accepted sessions) ---------- */
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const session = await MentorSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Check permissions
    if (req.user.role === 'student' && session.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'mentor' && session.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only allow status updates for accepted sessions
    if (session.status === 'requested') {
      return res.status(400).json({ message: 'Session must be accepted first' });
    }

    session.status = status;
    if (notes) session.notes = notes;
    await session.save();

    res.json({ session });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

