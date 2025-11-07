const mongoose = require('mongoose');

const LeisureHourRequestSchema = new mongoose.Schema(
  {
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // e.g., "09:00"
    endTime: { type: String, required: true }, // e.g., "11:00"
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminNotes: { type: String },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

LeisureHourRequestSchema.index({ mentor: 1, date: 1 });
LeisureHourRequestSchema.index({ status: 1 });

module.exports = mongoose.model('LeisureHourRequest', LeisureHourRequestSchema);

