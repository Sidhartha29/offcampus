const mongoose = require('mongoose');

const MentorSessionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    duration: { type: Number, default: 60 }, // in minutes
    topic: { type: String },
    status: { type: String, enum: ['requested', 'accepted', 'rejected', 'scheduled', 'completed', 'cancelled'], default: 'requested' },
    notes: { type: String },
    location: { type: String, default: 'Online' }
  },
  { timestamps: true }
);

MentorSessionSchema.index({ student: 1, date: 1 });
MentorSessionSchema.index({ mentor: 1, date: 1 });
MentorSessionSchema.index({ status: 1, date: 1 });

module.exports = mongoose.model('MentorSession', MentorSessionSchema);

