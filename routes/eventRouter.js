const router = require('express').Router();
const auth = require('../middleware/auth');
const EventBadge = require('../models/eventModel');

router.post('/new-event', auth, async (req, res) => {
  try {
    const { title, organizer, location, time, img } = req.body;

    if (!title || !organizer || !location || !time)
      return res.status(400).json({ msg: 'Not all field have been entered' });

    const newEvent = new EventBadge({
      userId: req.user,
      title,
      organizer,
      location,
      time,
      img,
    });

    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
