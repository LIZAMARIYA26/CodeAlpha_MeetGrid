const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  title: { type: String, required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Meeting', meetingSchema);