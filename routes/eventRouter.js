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

router.delete('/delete-event', auth, async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id)
      return res
        .status(400)
        .json({ msg: 'No event id founded, action denied' });

    const deletedEvent = await EventBadge.findByIdAndDelete(_id);
    res.json(deletedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/events/:id', auth, async (req, res) => {
  try {
    const event = await EventBadge.findOne({ _id: req.params.id });

    if (req.body.title) {
      event.title = req.body.title;
    }

    if (req.body.organizer) {
      event.organizer = req.body.organizer;
    }

    const updatedEvent = await event.save();
    res.send(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: "Event doesn't exists!" });
  }
});

module.exports = router;
