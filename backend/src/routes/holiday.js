const router = require('express').Router();
const { requireRole } = require('../middleware/roleCheck');
const HolidayRequest = require('../models/HolidayRequest');
const Notification = require('../models/Notification');

/* ---------- Request holiday (students only) ---------- */
router.post('/', async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can request holidays' });
    }

    const { startDate, endDate, reason } = req.body;
    const request = await HolidayRequest.create({
      userId: req.user.userId,
      student: req.user._id,
      startDate,
      endDate,
      reason,
      status: 'pending'
    });

    // Notify admins
    const admins = await require('mongoose').model('User').find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        userId: admin.userId,
        title: 'New Holiday Request',
        body: `${req.user.name} has requested a holiday from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`,
        type: 'holiday'
      });
    }

    res.status(201).json({ request });
  } catch (e) {
    next(e);
  }
});

/* ---------- Get my holiday requests ---------- */
router.get('/my', async (req, res, next) => {
  try {
    const requests = await HolidayRequest.find({ userId: req.user.userId })
      .populate('reviewedBy', 'userId name')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ requests });
  } catch (e) {
    next(e);
  }
});

/* ---------- Get all pending requests (admin only) ---------- */
router.get('/pending', requireRole('admin'), async (req, res, next) => {
  try {
    const requests = await HolidayRequest.find({ status: 'pending' })
      .populate('student', 'userId name profile')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ requests });
  } catch (e) {
    next(e);
  }
});

/* ---------- Approve/Reject holiday request (admin only) ---------- */
router.patch('/:id/review', requireRole('admin'), async (req, res, next) => {
  try {
    const { status, reviewComment } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await HolidayRequest.findById(req.params.id)
      .populate('student');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;
    request.reviewedBy = req.user._id;
    request.reviewComment = reviewComment;
    request.reviewedAt = new Date();
    await request.save();

    // Notify student
    await Notification.create({
      userId: request.student.userId,
      title: `Holiday Request ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      body: reviewComment || `Your holiday request has been ${status}`,
      type: 'holiday'
    });

    res.json({ request });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

