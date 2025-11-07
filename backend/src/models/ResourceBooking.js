const mongoose = require('mongoose');

const ResourceBookingSchema = new mongoose.Schema(
  {
    userId:   { type: String, required: true },
    resource: { type: String, required: true },
    date:     { type: Date, required: true },
    from:     { type: String, required: true },
    to:       { type: String, required: true },
    status:   { type: String, enum: ['confirmed','cancelled','pending'], default: 'confirmed' }
  },
  { timestamps: true }
);

ResourceBookingSchema.index({ resource: 1, date: 1, from: 1, to: 1 }, { unique: true });
ResourceBookingSchema.index({ userId: 1, date: 1 });
ResourceBookingSchema.index({ date: 1, status: 1 });
ResourceBookingSchema.index({ createdAt: -1 });
module.exports = mongoose.model('ResourceBooking', ResourceBookingSchema);