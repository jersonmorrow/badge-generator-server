const router = require('express').router();

router.get('/test', (req, res) => {
  res.send('it works');
});

module.exports = router;
