const express = require('express');
const authUser = require('../controllers/authUser');

const router = express.Router();

router.route('/register').post(authUser.registerUser);
router.route('/login').post(authUser.loginUser);

module.exports = router;
