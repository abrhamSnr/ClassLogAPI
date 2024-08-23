const express = require('express');
const upload = require('../utils/uploadFile');
const test = require('../controllers/testFile');
const authUser = require('../controllers/authUser');

const router = express.Router();

router
  .route('/registerTest/:id')
  .post(authUser.userAuth, upload.single('file'), test.creatTestFile);
router.route('/getAllTests/:id').get(authUser.userAuth, test.getAllTestFiles);
router
  .route('/getTest/:courseid/:testid')
  .get(authUser.userAuth, test.readTestfile);
router
  .route('/updateTest/:courseid/:testid')
  .put(authUser.userAuth, test.updateTestFileDate);
module.exports = router;
