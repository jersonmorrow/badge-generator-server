const bcrypt = require('bcryptjs');
const router = require('express').Router();
const User = require('../models/userModel');

router.post('/register', async (req, res) => {
  try {
    const { email, password, passwordCheck, displayName } = req.body;

    // validation
    if (!email || !password || !passwordCheck)
      return res.status(400).json({ msg: 'Not all field have been entered' });
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: 'Enter the same password twice for verification' });

    const existingUser = await User.findOne({ email: email });

    if (existingUser)
      return res
        .status(400)
        .json({ msg: 'An account with this email already exists' });

    if (!displayName) displayName = email;

    // hash password with bycript

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // save user to database
    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
