const express = require('express');
const course = require('../controllers/course');
const authUser = require('../controllers/authUser');

const router = express.Router();

router.route('/addcourse').post(authUser.userAuth, course.registerCourse);
router.route('/registerclass').post(authUser.userAuth, course.registerToCourse);
router
  .route('/getStudents/:id')
  .get(authUser.userAuth, course.getAllStudentsInCourse);
router.route('/getCourses').get(authUser.userAuth, course.getAllCoursesInfo);
router.route('/getCourse/:id').get(authUser.userAuth, course.getCourseInfo);
module.exports = router;
