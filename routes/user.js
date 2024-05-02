const express = require('express');

const router = express.Router();
const User = require('../controllers/user');

router
  .route('/')
  .get(User.getAllUsers)
  .post(User.registerUser);
router
  .route('/:id')
  .get(User.getUser)
  .put(User.updateUser)
  .delete(User.deleteUser);

module.exports = router;
