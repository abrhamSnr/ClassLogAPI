const Course = require('../models/course');
const User = require('../models/user');

const registerCourse = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    if (role !== 1) throw new Error('Not Authorized to perform this task');

    const { courseName, courseStartDate, courseEndDate } = req.body;
    if (!courseName || !courseStartDate || !courseEndDate)
      throw new Error('Please enter all required fileds');

    let courseCode = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const totalCodeLength = 8;
    for (let i = 0; i < totalCodeLength; i += 1) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      courseCode += chars[randomIndex];
    }
    const courseRegisterd = await Course({
      courseName: courseName,
      courseStartDate: courseStartDate,
      courseEndDate: courseEndDate,
      courseCode: courseCode,
      instructor: id
    });
    await courseRegisterd.save();
    res.status(200).json({
      id: courseCode,
      courseSessionId: courseRegisterd._id,
      message: 'Class created'
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

const registerToCourse = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    if (role !== 0) throw new Error('Not Authorized to perform this task');

    const { courseCode } = req.body;
    if (!courseCode) throw new Error('Please enter all required fileds');

    const courseByCourseCode = await Course.findOne({ courseCode });
    if (!courseByCourseCode) throw new Error('Course not exist');

    for (let i = 0; i < courseByCourseCode.students.length; i += 1) {
      if (id === courseByCourseCode.students[i].toString())
        throw new Error('Student already in class');
    }

    await Course.updateOne(
      { courseCode: courseCode },
      { $push: { students: id } }
    );

    res.status(200).json({
      courseSessionId: courseByCourseCode._id,
      message: 'Class registerd'
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

const getAllStudentsInCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const { id, role } = req.user;
    if (role !== 1) throw new Error('Not Authorized to perform this task');

    const course = await Course.findById(courseId);

    const allStudents = [];

    if (id !== course.instructor.toString())
      throw new Error(
        'Not Authorized to perform this task, instructor does not match'
      );

    for (let i = 0; i < course.students.length; i += 1) {
      const student = await User.findById(course.students[i]);
      allStudents.push({
        courseSessionId: courseId,
        studentId: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email
      });
    }
    res.status(400).json({
      students: allStudents
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

const getCourseInfo = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const { id, role } = req.user;
    const course = await Course.findById(courseId);
    let checkStudentInClass = false;

    if (role === 1) {
      if (id !== course.instructor.toString())
        throw new Error('Instructor not Authorized');
    }
    if (role === 0) {
      for (let i = 0; i < course.students.length; i += 1) {
        if (id === course.students[i].toString()) {
          checkStudentInClass = true;
        }
      }
    }
    if (checkStudentInClass) throw new Error('Student not authorized');
    res.status(200).json({
      value: [
        {
          courseSessionId: course._id,
          course: course.courseName,
          startDate: course.courseStartDate,
          endDate: course.courseEndDate
        }
      ]
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

const getAllCoursesInfo = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const allCourses = await Course.find();
    const courses = [];
    for (let i = 0; i < allCourses.length; i += 1) {
      if (role === 1) {
        if (id === allCourses[i].instructor.toString()) {
          courses.push({
            courseSessionId: allCourses[i]._id,
            courseName: allCourses[i].courseName,
            courseStartDate: allCourses[i].courseStartDate,
            courseEndDate: allCourses[i].courseEndDate,
            instructorId: allCourses[i].instructor,
            studentsId: allCourses[i].students
          });
        }
      }
      if (role === 0) {
        for (let j = 0; j < allCourses[i].students.length; j += 1) {
          if (id === allCourses[i].students[j].toString()) {
            courses.push({
              courseSessionId: allCourses[i]._id,
              courseName: allCourses[i].courseName,
              courseStartDate: allCourses[i].courseStartDate,
              courseEndDate: allCourses[i].courseEndDate,
              instructorId: allCourses[i].instructor
            });
          }
        }
      }
    }

    if (courses.length === 0) throw new Error('No class listed');
    res.status(200).json({
      courses
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

module.exports = {
  registerCourse,
  registerToCourse,
  getAllStudentsInCourse,
  getCourseInfo,
  getAllCoursesInfo
};
