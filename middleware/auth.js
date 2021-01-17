const jwt = require('jsonwebtoken');
const { config } = require('../config/index');

const auth = (req, res, next) => {
  try {
    const token = req.cookies.x_auth_token;
    if (!token)
      return res
        .status(401)
        .json({ msg: 'No authentication token, authorization denied' });

    const verified = jwt.verify(token, config.authJwtSecret);
    if (!verified)
      return res
        .status(401)
        .json({ msg: 'Token verification failed, authorization denied' });

    req.user = verified.id;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = auth;
