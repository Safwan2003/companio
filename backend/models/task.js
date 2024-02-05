const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'overdue', 'extended'],
    default: 'pending',
  },
});

// Update status based on deadline
taskSchema.pre('save', function(next) {
  if (this.deadline && this.deadline < new Date()) {
    this.status = 'overdue';
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
