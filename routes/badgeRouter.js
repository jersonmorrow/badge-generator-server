const router = require('express').Router();
const auth = require('../middleware/auth');
const Badge = require('../models/badgeModel');

router.post('/new-badge/:eventId', auth, async (req, res) => {
  try {
    const { name, lastName, email, jobTitle, categorie, badgeImage } = req.body;

    if (!name || !lastName || !email || !jobTitle || !categorie || !badgeImage)
      return res.status(400).json({ msg: 'Not all field have been entered' });

    const newBadge = new Badge({
      userId: req.user,
      eventId: req.params.eventId,
      name,
      lastName,
      email,
      jobTitle,
      categorie,
      badgeImage,
    });

    const savedBadge = await newBadge.save();
    res.status(200).json(savedBadge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/delete/:id', auth, async (req, res) => {
  try {
    await Badge.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'No badge founded, action denied' });
  }
});

router.patch('/update/:id', auth, async (req, res) => {
  try {
    const badge = await Badge.findOne({ _id: req.params.id });

    if (req.body.name) {
      badge.name = req.body.name;
    }

    if (req.body.lastName) {
      badge.lastName = req.body.lastName;
    }

    if (req.body.email) {
      badge.email = req.body.email;
    }

    if (req.body.jobTitle) {
      badge.jobTitle = req.body.jobTitle;
    }

    if (req.body.categorie) {
      badge.categorie = req.body.categorie;
    }

    if (req.body.badgeImage) {
      badge.badgeImage = req.body.badgeImage;
    }

    const updatedBadge = await badge.save();
    res.send(updatedBadge);
  } catch (error) {
    res.status(400).json({ error: "Badge doesn't exists!" });
  }
});

module.exports = router;
