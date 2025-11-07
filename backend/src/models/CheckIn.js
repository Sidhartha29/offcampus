const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema(
  {
    userId:    { type: String, required: true },
    campusLat:{ type: Number, required: true },
    campusLng:{ type: Number, required: true },
    deviceLat:{ type: Number, required: true },
    deviceLng:{ type: Number, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] } // [longitude, latitude]
    },
    distance: { type: Number }, // Distance from campus in meters
    timestamp:{ type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Indexes for better query performance
CheckInSchema.index({ userId: 1, timestamp: -1 });
CheckInSchema.index({ location: '2dsphere' }); // Geospatial index
CheckInSchema.index({ timestamp: -1 });

module.exports = mongoose.model('CheckIn', CheckInSchema);