const Answer = require('../models/answerFile');

const createAnsFile = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    if (role !== 1) throw new Error('Not Authorized');
    const { testId } = req.params;
    const answer = await Answer({
      answerFileName: req.file.originalname,
      testAnswers: req.file.buffer,
      answerFileType: req.file.mimetype,
      testId: testId
    });
    await answer.save();
    res.status(200).json({
      answerId: answer._id,
      message: 'Answer created successfully'
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

const readAnsFile = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const { answerId } = req.params;
    const { id, role } = req.user;
    if (role !== 1) throw new Error('Not Authorized');
    const answerFile = await Answer.findOne({ _id: answerId, testId: testId });
    if (!answerFile) throw new Error('File does not exist');
    res.setHeader(
      'Content-Diposition',
      `attachment; filename="${answerFile.answerFileName}"`
    );
    res.setHeader('Content-Type', answerFile.answerFileType);
    res.send(answerFile.testAnswers);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

const deleteAnsFile = async (req, res, next) => {
  try {
    const { answerId } = req.params;

    const answerDeleted = await Answer.findByIdAndDelete(answerId);
    if (!answerDeleted) throw new Error('Answer file not found');
    res.status(200).json({
      message: 'Answer File Deleted'
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

module.exports = {
  createAnsFile,
  readAnsFile,
  deleteAnsFile
};
