const mongoose = require('mongoose');

const EngagementLogSchema = new mongoose.Schema(
  {
    userId:    { type: String, required: true, index: true },
    event:     { type: String, required: true },
    meta:      { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

// Additional indexes for better query performance
EngagementLogSchema.index({ timestamp: -1 });
EngagementLogSchema.index({ event: 1, timestamp: -1 });
EngagementLogSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('EngagementLog', EngagementLogSchema);