const mongoose = require('mongoose');

const MentorMatchSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    mentor:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status:  { type: String, enum: ['pending','active','blocked'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Indexes for better query performance
MentorMatchSchema.index({ mentor: 1, status: 1 });
MentorMatchSchema.index({ status: 1 });
MentorMatchSchema.index({ createdAt: -1 });

module.exports = mongoose.model('MentorMatch', MentorMatchSchema);