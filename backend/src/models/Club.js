const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    category: { type: String, enum: ['academic', 'sports', 'cultural', 'technical', 'social', 'other'], default: 'other' },
    president: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    image: { type: String },
    meetingSchedule: {
      day: { type: String },
      time: { type: String },
      location: { type: String }
    }
  },
  { timestamps: true }
);

ClubSchema.index({ name: 1 });
ClubSchema.index({ category: 1 });
ClubSchema.index({ status: 1 });

module.exports = mongoose.model('Club', ClubSchema);

