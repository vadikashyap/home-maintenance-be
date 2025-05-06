const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isPredefined: {
    type: Boolean,
    default: false,
  },
  reminderTime: {
    type: Date,
  },
  isReminderSet: { type: Boolean, default: false },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Task', taskSchema);
