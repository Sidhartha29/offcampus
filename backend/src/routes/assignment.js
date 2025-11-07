const router = require('express').Router();
const Assignment = require('../models/Assignment');
const Notification = require('../models/Notification');
const User = require('../models/User');
// File upload can be handled via cloud storage (AWS S3, Cloudinary, etc.)
// For now, we'll accept file URLs

/* ---------- Create assignment (mentors only) ---------- */
router.post('/', async (req, res, next) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can create assignments' });
    }

    const { title, description, course, dueDate, maxMarks, assignedTo } = req.body;
    
    // If assignedTo is provided, validate that all IDs are valid students
    let studentIds = [];
    if (assignedTo && assignedTo.length > 0) {
      const students = await User.find({ 
        _id: { $in: assignedTo }, 
        role: 'student' 
      }).select('_id userId name');
      
      if (students.length !== assignedTo.length) {
        return res.status(400).json({ message: 'Some selected students are invalid' });
      }
      
      studentIds = students.map(s => s._id);
    }

    const assignment = await Assignment.create({
      title,
      description,
      course,
      mentor: req.user._id,
      assignedTo: studentIds, // Assign to specific students or empty array for all
      dueDate,
      maxMarks: maxMarks || 100
    });

    // Notify only assigned students (or all if none specified)
    const studentsToNotify = studentIds.length > 0 
      ? await User.find({ _id: { $in: studentIds } })
      : await User.find({ role: 'student' });
      
    await Notification.insertMany(
      studentsToNotify.map((student) => ({
        userId: student.userId,
        title: 'New Assignment',
        body: `New assignment: ${title} for ${course}`,
        type: 'assignment'
      }))
    );

    res.status(201).json({ assignment });
  } catch (e) {
    next(e);
  }
});

/* ---------- Get assignments (students see only their assigned ones, mentors see their own) ---------- */
router.get('/', async (req, res, next) => {
  try {
    let assignments;
    if (req.user.role === 'mentor') {
      assignments = await Assignment.find({ mentor: req.user._id })
        .populate('submissions.student', 'userId name')
        .populate('assignedTo', 'userId name')
        .sort({ dueDate: 1 })
        .lean();
    } else if (req.user.role === 'student') {
      // Students see assignments assigned to them OR assignments with no specific assignment (assigned to all)
      assignments = await Assignment.find({
        status: 'active',
        $or: [
          { assignedTo: req.user._id },
          { assignedTo: { $exists: false } },
          { $expr: { $eq: [{ $size: '$assignedTo' }, 0] } }
        ]
      })
        .populate('mentor', 'userId name')
        .populate('submissions.student', 'userId name')
        .sort({ dueDate: 1 })
        .lean();
    } else {
      // Admin sees all
      assignments = await Assignment.find({ status: 'active' })
        .populate('mentor', 'userId name')
        .populate('assignedTo', 'userId name')
        .sort({ dueDate: 1 })
        .lean();
    }
    res.json({ assignments });
  } catch (e) {
    next(e);
  }
});

/* ---------- Submit assignment (students only) ---------- */
router.post('/:id/submit', async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit assignments' });
    }

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const existingSubmission = assignment.submissions.find(
      s => s.student.toString() === req.user._id.toString()
    );

    const submissionData = {
      student: req.user._id,
      fileUrl: req.body.fileUrl || req.body.file,
      submittedAt: new Date(),
      status: new Date() > assignment.dueDate ? 'late' : 'submitted'
    };

    if (existingSubmission) {
      existingSubmission.fileUrl = submissionData.fileUrl;
      existingSubmission.submittedAt = submissionData.submittedAt;
      existingSubmission.status = submissionData.status;
    } else {
      assignment.submissions.push(submissionData);
    }

    await assignment.save();

    // Notify mentor
    const mentor = await User.findById(assignment.mentor).select('userId name');
    if (mentor) {
      await Notification.create({
        userId: mentor.userId,
        title: 'Assignment Submitted',
        body: `${req.user.name} submitted ${assignment.title}`,
        type: 'assignment'
      });
    }

    res.json({ message: 'Assignment submitted successfully' });
  } catch (e) {
    next(e);
  }
});

/* ---------- Grade assignment (mentors only) ---------- */
router.patch('/:id/grade/:submissionId', async (req, res, next) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can grade assignments' });
    }

    const { marks, feedback } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    if (assignment.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your assignment' });
    }

    const submission = assignment.submissions.id(req.params.submissionId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.marks = marks;
    submission.feedback = feedback;
    submission.status = 'graded';
    await assignment.save();

    // Notify student
    const student = await User.findById(submission.student);
    if (student) {
      await Notification.create({
        userId: student.userId,
        title: 'Assignment Graded',
        body: `Your assignment ${assignment.title} has been graded. Marks: ${marks}/${assignment.maxMarks}`,
        type: 'assignment'
      });
    }

    res.json({ message: 'Assignment graded successfully' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

