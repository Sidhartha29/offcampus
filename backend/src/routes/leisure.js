const router = require('express').Router();
const LeisureHourRequest = require('../models/LeisureHourRequest');
const Notification = require('../models/Notification');
const Timetable = require('../models/Timetable');
const User = require('../models/User');
const { requireRole } = require('../middleware/roleCheck');

/* ---------- Request leisure hours (mentor only) ---------- */
router.post('/request', async (req, res, next) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can request leisure hours' });
    }

    const { date, startTime, endTime } = req.body;
    
    if (!date || !startTime || !endTime) {
      return res.status(400).json({ message: 'Date, start time, and end time are required' });
    }

    const request = await LeisureHourRequest.create({
      mentor: req.user._id,
      date,
      startTime,
      endTime,
      status: 'pending'
    });

    // Notify admin
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        userId: admin.userId,
        title: 'Leisure Hour Request',
        body: `${req.user.name} requested leisure hours on ${new Date(date).toLocaleDateString()} from ${startTime} to ${endTime}`,
        type: 'general'
      });
    }

    // Notify assigned students about mentor's leisure hours (if mentor has mentees)
    const MentorMatch = require('../models/MentorMatch');
    const menteeMatches = await MentorMatch.find({ mentor: req.user._id, status: 'active' })
      .populate('student', 'userId name');
    
    for (const match of menteeMatches) {
      await Notification.create({
        userId: match.student.userId,
        title: 'Mentor Leisure Hours Available',
        body: `Your mentor ${req.user.name} has requested leisure hours on ${new Date(date).toLocaleDateString()} from ${startTime} to ${endTime}. Sessions may be scheduled during this time.`,
        type: 'mentor'
      });
    }

    res.status(201).json({ request, message: 'Leisure hour request submitted' });
  } catch (e) {
    next(e);
  }
});

/* ---------- Get my leisure hour requests (mentor) ---------- */
router.get('/my-requests', async (req, res, next) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can view their requests' });
    }

    const requests = await LeisureHourRequest.find({ mentor: req.user._id })
      .sort({ date: -1 })
      .lean();

    res.json({ requests });
  } catch (e) {
    next(e);
  }
});

/* ---------- Get all pending requests (admin only) ---------- */
router.get('/pending', requireRole('admin'), async (req, res, next) => {
  try {
    const requests = await LeisureHourRequest.find({ status: 'pending' })
      .populate('mentor', 'userId name profile')
      .sort({ date: 1 })
      .lean();

    res.json({ requests });
  } catch (e) {
    next(e);
  }
});

/* ---------- Approve leisure hour request and create timetable (admin only) ---------- */
router.post('/:id/approve', requireRole('admin'), async (req, res, next) => {
  try {
    const { assignedStudents } = req.body; // Array of student IDs to assign to this mentor
    const request = await LeisureHourRequest.findById(req.params.id)
      .populate('mentor', 'userId name');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    // Update request status
    request.status = 'approved';
    if (req.body.adminNotes) {
      request.adminNotes = req.body.adminNotes;
    }
    await request.save();

    // Create timetable entries for assigned students
    if (assignedStudents && assignedStudents.length > 0) {
      const students = await User.find({ 
        _id: { $in: assignedStudents }, 
        role: 'student' 
      });

      for (const student of students) {
        // Create or update timetable for the student
        const timetableDate = new Date(request.date);
        timetableDate.setHours(0, 0, 0, 0);

        await Timetable.findOneAndUpdate(
          { userId: student.userId, date: timetableDate },
          {
            $push: {
              slots: {
                start: request.startTime,
                end: request.endTime,
                course: `Mentor Session - ${request.mentor.name}`,
                type: 'tutorial'
              }
            }
          },
          { upsert: true, new: true }
        );

        // Notify student
        await Notification.create({
          userId: student.userId,
          title: 'Mentor Session Scheduled',
          body: `You have been assigned a mentor session with ${request.mentor.name} on ${timetableDate.toLocaleDateString()} from ${request.startTime} to ${request.endTime}`,
          type: 'timetable'
        });
      }
    }

    // Notify mentor
    await Notification.create({
      userId: request.mentor.userId,
      title: 'Leisure Hour Request Approved',
      body: `Your leisure hour request for ${new Date(request.date).toLocaleDateString()} has been approved${assignedStudents && assignedStudents.length > 0 ? ` and ${assignedStudents.length} student(s) have been assigned` : ''}`,
      type: 'general'
    });

    res.json({ message: 'Request approved and timetable created', request });
  } catch (e) {
    next(e);
  }
});

/* ---------- Reject leisure hour request (admin only) ---------- */
router.post('/:id/reject', requireRole('admin'), async (req, res, next) => {
  try {
    const request = await LeisureHourRequest.findById(req.params.id)
      .populate('mentor', 'userId name');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'rejected';
    if (req.body.adminNotes) {
      request.adminNotes = req.body.adminNotes;
    }
    await request.save();

    // Notify mentor
    await Notification.create({
      userId: request.mentor.userId,
      title: 'Leisure Hour Request Rejected',
      body: `Your leisure hour request for ${new Date(request.date).toLocaleDateString()} has been rejected${req.body.adminNotes ? `. Reason: ${req.body.adminNotes}` : ''}`,
      type: 'general'
    });

    res.json({ message: 'Request rejected', request });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

