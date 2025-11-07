const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  start:  { type: String, required: true },
  end:    { type: String, required: true },
  course: { type: String, required: true },
  type:   { type: String, enum: ['lecture','lab','tutorial','self'] }
});

const TimetableSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    date:   { type: Date, required: true },
    slots:  [SlotSchema]
  },
  { timestamps: true }
);

TimetableSchema.index({ userId: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('Timetable', TimetableSchema);