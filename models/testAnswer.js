const mongoose = require('mongoose');

const testAnswer = mongoose.Schema({
  testFileName: {
    type: String,
    required: true
  },
  testAnswers: {
    type: Buffer,
    required: [true, 'Please eneter upload test answers']
  },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' }
});

const TestAnswer = mongoose.model('TestAnswer', testAnswer);

module.exports = TestAnswer;
