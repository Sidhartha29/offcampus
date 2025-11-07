// src/routes/checkin.js
const router = require('express').Router();
const CheckIn = require('../models/CheckIn');

// Helper function to calculate distance between two coordinates (Haversine formula)
// Returns distance in meters
function calculateDistance(lat1, lon1, lat2, lon2) {
  // Validate inputs
  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return null;
  }
  
  const R = 6371000; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const distance = R * c; // Distance in meters
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/* ---------- Student (or any user) records a campus check‑in ---------- */
router.post('/', async (req, res, next) => {
  try {
    const { campusLat, campusLng, deviceLat, deviceLng } = req.body;
    
    if (!campusLat || !campusLng || !deviceLat || !deviceLng) {
      return res.status(400).json({ message: 'All location coordinates are required' });
    }
    
    // Calculate distance from campus
    const distance = calculateDistance(
      parseFloat(campusLat), 
      parseFloat(campusLng), 
      parseFloat(deviceLat), 
      parseFloat(deviceLng)
    );
    
    if (distance === null) {
      return res.status(400).json({ message: 'Invalid location coordinates' });
    }
    
    // Determine if user is near campus (within 500 meters)
    const isNearCampus = distance <= 500;
    
    const entry = await CheckIn.create({
      userId: req.user.userId,
      campusLat,
      campusLng,
      deviceLat,
      deviceLng,
      location: {
        type: 'Point',
        coordinates: [deviceLng, deviceLat] // MongoDB uses [longitude, latitude]
      },
      distance
    });
    
    res.status(201).json({ 
      message: isNearCampus ? 'Check-in successful! You are near campus.' : 'Check-in recorded. You are far from campus.',
      entry,
      distance: Math.round(distance),
      isNearCampus,
      distanceKm: (distance / 1000).toFixed(2)
    });
  } catch (e) {
    next(e);
  }
});

/* ---------- Admin/mentor fetch recent check‑ins (optional filtering) ---------- */
router.get('/recent', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const userId = req.query.userId;
    
    const query = {};
    if (userId) query.userId = userId;
    
    const logs = await CheckIn.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({ logs });
  } catch (e) {
    next(e);
  }
});

/* ---------- Location-based filtering: Find check-ins within radius ---------- */
router.get('/nearby', async (req, res, next) => {
  try {
    const { lat, lng, radius = 5000 } = req.query; // radius in meters, default 5km
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude required' });
    }
    
    const logs = await CheckIn.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    
    res.json({ logs, count: logs.length });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
