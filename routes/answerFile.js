const express = require('express');
const answerFile = require('../controllers/answerFile');
const authUser = require('../controllers/authUser');
const upload = require('../utils/uploadFile');

const router = express.Router();

router
  .route('/createAnswer/:testId')
  .post(authUser.userAuth, upload.single('file'), answerFile.createAnsFile);
router
  .route('/getAnswer/:testId/:answerId')
  .get(authUser.userAuth, answerFile.readAnsFile);
router
  .route('/deleteAnswer/:answerId')
  .delete(authUser.userAuth, answerFile.deleteAnsFile);

module.exports = router;
