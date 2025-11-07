// src/routes/location.js
const router = require('express').Router();
const User = require('../models/User');
const CheckIn = require('../models/CheckIn');

/* ---------- Update user location ---------- */
router.post('/update', async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude required' });
    }
    
    await User.findByIdAndUpdate(req.user._id, {
      'profile.location': {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      }
    });
    
    res.json({ message: 'Location updated successfully' });
  } catch (e) {
    next(e);
  }
});

/* ---------- Find users near a location ---------- */
router.get('/users/nearby', async (req, res, next) => {
  try {
    const { lat, lng, radius = 10000, role } = req.query; // radius in meters, default 10km
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude required' });
    }
    
    const query = {
      'profile.location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    };
    
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query)
      .select('userId name role profile.college profile.homeTown profile.location')
      .limit(50)
      .lean();
    
    res.json({ users, count: users.length });
  } catch (e) {
    next(e);
  }
});

/* ---------- Get user's current location ---------- */
router.get('/me', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('profile.location')
      .lean();
    
    if (!user.profile.location || !user.profile.location.coordinates) {
      return res.json({ location: null, message: 'Location not set' });
    }
    
    res.json({
      location: {
        latitude: user.profile.location.coordinates[1],
        longitude: user.profile.location.coordinates[0]
      }
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

