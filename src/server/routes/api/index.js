const { Router } = require('express');
const login = require('./login');

const router = Router();

router.post('/login', login);

module.exports = router;
