const express = require('express');
const course = require('../controllers/course');
const authUser = require('../controllers/authUser');

const router = express.Router();

router.route('/addcourse').post(authUser.userAuth, course.registerCourse);
router.route('/registerclass').post(authUser.userAuth, course.registerToCourse);
router
  .route('/getStudents/:id')
  .get(authUser.userAuth, course.getAllStudentsInCourse);
module.exports = router;
