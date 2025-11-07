const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    name:   { type: String, required: true },
    role:   { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' },
    email:  { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profile: {
      college:   { type: String },
      year:      { type: Number },
      commuting: { type: Boolean, default: false },
      homeTown:  { type: String },
      phone:     { type: String },
      bio:       { type: String },
      avatar:    { type: String },
      location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
      }
    },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // only for students
  },
  { timestamps: true }
);

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ userId: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ 'profile.location': '2dsphere' }); // Geospatial index for location-based queries

module.exports = mongoose.model('User', UserSchema);