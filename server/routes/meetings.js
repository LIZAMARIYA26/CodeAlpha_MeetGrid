const router = require('express').Router();
const Meeting = require('../models/Meeting');

// Save a meeting schedule
router.post('/create', async (req, res) => {
  try {
    const { roomId, title, hostId, startTime } = req.body;
    const newMeeting = new Meeting({ roomId, title, hostId, startTime });
    await newMeeting.save();
    res.status(201).json({ message: 'Meeting scheduled successfully', meeting: newMeeting });
  } catch (err) {
    res.status(500).json({ message: 'Error scheduling meeting' });
  }
});

// Get scheduled meetings for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const meetings = await Meeting.find({ hostId: req.params.userId }).sort({ startTime: 1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching meetings' });
  }
});

module.exports = router;