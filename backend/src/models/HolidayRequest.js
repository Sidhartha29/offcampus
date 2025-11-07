const mongoose = require('mongoose');

const HolidayRequestSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewComment: { type: String },
    reviewedAt: { type: Date }
  },
  { timestamps: true }
);

HolidayRequestSchema.index({ userId: 1, status: 1 });
HolidayRequestSchema.index({ status: 1 });
HolidayRequestSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('HolidayRequest', HolidayRequestSchema);

