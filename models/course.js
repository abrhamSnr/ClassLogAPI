const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  courseName: {
    type: String,
    required: [true, 'Please enter the course name']
  },
  courseStartDate: { type: Date, require: [true, 'Please enter start date'] },
  courseEndDate: { type: Date, require: [true, 'Please enter end date'] },
  courseCode: String,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
