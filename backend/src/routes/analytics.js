// src/routes/analytics.js - Data visualization endpoints
const router = require('express').Router();
const { requireRole } = require('../middleware/roleCheck');
const EngagementLog = require('../models/EngagementLog');
const CheckIn = require('../models/CheckIn');
const User = require('../models/User');
const ResourceBooking = require('../models/ResourceBooking');
const MentorMatch = require('../models/MentorMatch');

/* ---------- Get engagement statistics for visualization ---------- */
router.get('/engagement', requireRole('admin', 'mentor'), async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    // Daily engagement counts
    const dailyEngagement = await EngagementLog.aggregate([
      { $match: { timestamp: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Event type distribution
    const eventTypes = await EngagementLog.aggregate([
      { $match: { timestamp: { $gte: since } } },
      {
        $group: {
          _id: '$event',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Active users over time
    const activeUsers = await EngagementLog.distinct('userId', { timestamp: { $gte: since } });
    
    res.json({
      period: `${days} days`,
      dailyEngagement,
      eventTypes,
      totalEvents: dailyEngagement.reduce((sum, day) => sum + day.count, 0),
      activeUsers: activeUsers.length
    });
  } catch (e) {
    next(e);
  }
});

/* ---------- Get check-in statistics ---------- */
router.get('/checkins', requireRole('admin', 'mentor'), async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    // Daily check-ins
    const dailyCheckIns = await CheckIn.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          avgDistance: { $avg: '$distance' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Check-ins by user
    const checkInsByUser = await CheckIn.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Average distance from campus
    const avgDistance = await CheckIn.aggregate([
      { $match: { createdAt: { $gte: since }, distance: { $exists: true } } },
      {
        $group: {
          _id: null,
          avgDistance: { $avg: '$distance' },
          maxDistance: { $max: '$distance' },
          minDistance: { $min: '$distance' }
        }
      }
    ]);
    
    res.json({
      period: `${days} days`,
      dailyCheckIns,
      checkInsByUser,
      distanceStats: avgDistance[0] || {}
    });
  } catch (e) {
    next(e);
  }
});

/* ---------- Get user distribution statistics ---------- */
router.get('/users', requireRole('admin'), async (req, res, next) => {
  try {
    // Users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Users by year (students)
    const usersByYear = await User.aggregate([
      { $match: { role: 'student', 'profile.year': { $exists: true } } },
      {
        $group: {
          _id: '$profile.year',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Commuting vs non-commuting
    const commutingStats = await User.aggregate([
      { $match: { role: 'student' } },
      {
        $group: {
          _id: '$profile.commuting',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      usersByRole,
      usersByYear,
      commutingStats
    });
  } catch (e) {
    next(e);
  }
});

/* ---------- Get booking statistics ---------- */
router.get('/bookings', requireRole('admin', 'mentor'), async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    // Bookings by resource
    const bookingsByResource = await ResourceBooking.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: '$resource',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Bookings by status
    const bookingsByStatus = await ResourceBooking.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Daily bookings
    const dailyBookings = await ResourceBooking.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      period: `${days} days`,
      bookingsByResource,
      bookingsByStatus,
      dailyBookings
    });
  } catch (e) {
    next(e);
  }
});

/* ---------- Get mentor matching statistics ---------- */
router.get('/mentors', requireRole('admin'), async (req, res, next) => {
  try {
    // Active matches
    const activeMatches = await MentorMatch.countDocuments({ status: 'active' });
    const pendingMatches = await MentorMatch.countDocuments({ status: 'pending' });
    
    // Mentors with most mentees
    const mentorsWithMentees = await MentorMatch.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$mentor',
          menteeCount: { $sum: 1 }
        }
      },
      { $sort: { menteeCount: -1 } },
      { $limit: 10 }
    ]);
    
    // Populate mentor names
    const mentorIds = mentorsWithMentees.map(m => m._id);
    const mentors = await User.find({ _id: { $in: mentorIds } })
      .select('userId name')
      .lean();
    
    const mentorsWithNames = mentorsWithMentees.map(m => {
      const mentor = mentors.find(ment => ment._id.toString() === m._id.toString());
      return {
        mentorId: mentor?.userId || 'Unknown',
        mentorName: mentor?.name || 'Unknown',
        menteeCount: m.menteeCount
      };
    });
    
    res.json({
      activeMatches,
      pendingMatches,
      topMentors: mentorsWithNames
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

