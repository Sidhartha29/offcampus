const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    userId:    { type: String, required: true, index: true },
    title:     { type: String, required: true },
    body:      { type: String },
    type:      { type: String, enum: ['class','transport','event','general','holiday','club','assignment','mentor','timetable'], default: 'general' },
    read:      { type: Boolean, default: false },
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, read: 1 });
NotificationSchema.index({ type: 1, createdAt: -1 });
module.exports = mongoose.model('Notification', NotificationSchema);