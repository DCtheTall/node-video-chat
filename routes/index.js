"use strict";

let express = require('express')
  , router = express.Router();

router.get('/', (req, res) => {
  res.render('index.jade');
});

router.post('/pusher/auth', require('./pusher-auth'));

module.exports = router;
