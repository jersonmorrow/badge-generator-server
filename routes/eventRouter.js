const router = require('express').Router();
const auth = require('../middleware/auth');
const EventBadge = require('../models/eventModel');
const Badge = require('../models/badgeModel');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.post(
  '/new-event',
  auth,
  upload.single('eventImage'),
  async (req, res) => {
    try {
      const { title, organizer, location, date } = req.body;
      let eventImage;

      if (!title || !organizer || !location || !date)
        return res.status(400).json({ msg: 'Not all field have been entered' });

      if (req.file !== undefined) {
        eventImage = req.file.path;
      }

      const newEvent = new EventBadge({
        userId: req.user,
        title,
        organizer,
        location,
        date,
        eventImage,
      });

      const savedEvent = await newEvent.save();
      res.status(200).json(savedEvent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const eventDoc = await EventBadge.findOne({ _id: req.params.id });
    let filePath = eventDoc.eventImage;

    if (filePath) {
      fs.unlinkSync(filePath);
      console.log('image deleted successfully');
    }

    await EventBadge.deleteOne({ _id: req.params.id });
    await Badge.deleteMany({ eventId: req.params.id });

    res.status(204).send('deleted successfully');
  } catch (error) {
    res.status(400).json({ error: 'No event founded, action denied' });
  }
});

router.patch(
  '/update/:id',
  auth,
  upload.single('eventImage'),
  async (req, res) => {
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

      if (req.body.date) {
        event.date = req.body.date;
      }

      if (req.file !== undefined) {
        let filePath = event.eventImage;
        if (filePath) {
          if (filePath != req.file.path) {
            fs.unlinkSync(filePath);
            console.log('image replaced successfully');
          }
        }
        event.eventImage = req.file.path;
      }

      const updatedEvent = await event.save();
      res.send(updatedEvent);
    } catch (error) {
      res.status(400).json({ error: "Event doesn't exists!" });
    }
  }
);

router.get('/:id', auth, async (req, res) => {
  const event = await EventBadge.findOne({ _id: req.params.id });
  res.send(event);
});

router.get('/', auth, async (req, res) => {
  try {
    const events = await EventBadge.find({ userId: req.user });
    res.send(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
