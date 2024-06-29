const mongoose = require('mongoose');

const testAnsSchema = mongoose.Schema({
  answerFileName: {
    type: String,
    required: true,
    unique: true
  },
  testAnswers: {
    type: Buffer,
    required: [true, 'Please upload test answer']
  },
  answerFileType: {
    type: String,
    required: true
  },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' }
});

const Answer = mongoose.model('Answer', testAnsSchema);

module.exports = Answer;
