const { response } = require('express');

const router = require('express').Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, passwordCheck, displayName } = req.body;

    // validation
    if (!email || !password || !passwordCheck || !displayName)
      return res.status(400).json({ msg: 'Not all field have been entered' });
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: 'Enter the same password twice for verification' });

    const existingUser = await User.find({ email: email });

    if (existingUser)
      return res
        .status(400)
        .json({ msg: 'An account with this email already exists' });

    if (!displayName) displayName = email;
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
