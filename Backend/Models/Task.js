const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: String,
  status: { type: String, default: 'pending' },
  leaderPlan: String,
  executionResult: String,
  auditStatus: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);
