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

router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const deletedEvent = await EventBadge.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'No event founded, action denied' });
  }
});

router.patch('/update/:id', auth, async (req, res) => {
  try {
    const event = await EventBadge.findOne({ _id: req.params.id });

    if (req.body.title) {
      event.title = req.body.title;
    }

    if (req.body.organizer) {
      event.organizer = req.body.organizer;
    }

    if (req.body.location) {
      event.location = req.body.location;
    }

    if (req.body.time) {
      event.time = req.body.time;
    }

    const updatedEvent = await event.save();
    res.send(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: "Event doesn't exists!" });
  }
});

router.get('/:id', auth, async (req, res) => {
  const event = await EventBadge.findOne({ _id: req.params.id });
  res.send(event);
});

module.exports = router;
