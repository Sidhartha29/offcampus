const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    course: { type: String, required: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Specific students assigned to this assignment
    dueDate: { type: Date, required: true },
    maxMarks: { type: Number, default: 100 },
    submissions: [{
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      fileUrl: { type: String },
      submittedAt: { type: Date, default: Date.now },
      marks: { type: Number },
      feedback: { type: String },
      status: { type: String, enum: ['submitted', 'graded', 'late'], default: 'submitted' }
    }],
    status: { type: String, enum: ['active', 'closed'], default: 'active' }
  },
  { timestamps: true }
);

AssignmentSchema.index({ mentor: 1, status: 1 });
AssignmentSchema.index({ dueDate: 1 });
AssignmentSchema.index({ 'submissions.student': 1 });
AssignmentSchema.index({ assignedTo: 1 }); // Index for filtering assignments by assigned students

module.exports = mongoose.model('Assignment', AssignmentSchema);

