const bcrypt = require('bcryptjs');
const router = require('express').Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { config } = require('../config/index');
const TWENTY_FOUR_HOURS = 86400000; // 24HR in milliseconds

router.post('/sign-up', async (req, res) => {
  try {
    const { firstName, lastName, email, password, passwordCheck } = req.body;

    // validation
    if (!firstName || !lastName || !email || !password || !passwordCheck)
      return res.status(400).json({ msg: 'Not all field have been entered' });
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: 'Enter the same password twice for verification' });

    // hash password with bycript

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // save user to database
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: 'Not all field have been entered' });

    const user = await User.findOne({ email: email });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.status(400).json({ msg: 'Invalid Password' });

    const token = jwt.sign({ id: user._id }, config.authJwtSecret);

    res.status(202).cookie('x_auth_token', token, {
      maxAge: TWENTY_FOUR_HOURS,
      httpOnly: true,
      secure: true,
    });

    res.json({
      user: {
        id: user._id,
        name: user.firstName,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  const token = req.cookies.x_auth_token;
  res
    .status(202)
    .cookie('x_auth_token', token, {
      maxAge: 0,
      httpOnly: true,
      secure: true,
    })
    .send('cookie invalidate');
});

router.delete('/delete', auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/tokenIsValid', async (req, res) => {
  try {
    const token = req.cookies.x_auth_token;
    if (!token) return res.json(false);

    const verified = jwt.verify(token, config.authJwtSecret);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.status(200).json(true);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    name: user.firstName,
    id: user._id,
  });
});

router.post('/check-user', async (req, res) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    return res.status(200).json({ status: 'EXISTS' });
  } else {
    return res.status(200).json({ status: 'DOES NOT EXISTS' });
  }
});

module.exports = router;
