const Test = require('../models/testFile');

const creatTestFile = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const { testStartDate, testEndDate } = JSON.parse(req.body.data);
    const test = await Test({
      testFileName: req.file.originalname,
      testStartDate: new Date(testStartDate),
      testEndDate: new Date(testEndDate),
      testQuestions: req.file.buffer,
      courseId: courseId
    });
    await test.save();
    res.status(200).json({
      testId: test._id,
      message: 'Test created successfully'
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// const updateTestFile = async (req, res, next) => {
//   try {

//   }catch (err) {
//     res.status(400).json({
//       message: err.message
//     });
//   }
// }

module.exports = {
  creatTestFile
};
