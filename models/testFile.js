const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
  testFileName: {
    type: String,
    required: true,
    unique: true
  },
  testStartDate: {
    type: Date,
    required: [true, 'Please eneter test start date']
  },
  testEndDate: { type: Date, required: [true, 'Please eneter test end date'] },
  testQuestions: {
    type: Buffer,
    required: [true, 'Please eneter upload test questions']
  },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
