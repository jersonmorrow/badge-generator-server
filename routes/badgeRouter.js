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
      eventId: req.params.id,
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

module.exports = router;
