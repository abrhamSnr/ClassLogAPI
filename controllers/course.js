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

    const checkIdInArray = await Course.find({ students: { $in: [id] } });
    //If there is no value in the array,the upper method will give an empty array
    if (checkIdInArray.length > 0)
      throw new Error('Student already resgisterd');

    await Course.updateOne(
      { courseCode: courseCode },
      { $push: { students: id } }
    );

    res.status(200).json({
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

    if (role === 1) {
      if (id !== course.instructor.toString())
        throw new Error('Instructor not Authorized');
    }
    if (role === 0) {
      const checkStudent = await Course.find({ student: { $in: [id] } });
      if (checkStudent.length <= 0) throw new Error('Student not authorized');
    }
    res.status(200).json({
      value: [
        {
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

module.exports = {
  registerCourse,
  registerToCourse,
  getAllStudentsInCourse,
  getCourseInfo
};
