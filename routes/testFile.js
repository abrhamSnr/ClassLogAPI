const express = require('express');
const upload = require('../utils/uploadFile');
const test = require('../controllers/testFile');

const router = express.Router();

router
  .route('/registerTest/:id')
  .post(upload.single('file'), test.creatTestFile);

module.exports = router;
