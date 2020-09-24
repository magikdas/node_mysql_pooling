const express = require('express');

const tutor = require('./tutor');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/tutor', tutor);

module.exports = router;
