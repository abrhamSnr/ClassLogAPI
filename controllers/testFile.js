const Test = require('../models/testFile');

const creatTestFile = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    if (role !== 1) throw new Error('Not Authorized');
    //Compare if user id is the course creator

    const courseId = req.params.id;
    const { testStartDate, testEndDate } = JSON.parse(req.body.data);
    const test = await Test({
      testFileName: req.file.originalname,
      testStartDate: new Date(testStartDate),
      testEndDate: new Date(testEndDate),
      testQuestions: req.file.buffer,
      testFileType: req.file.mimetype,
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

const getAllTestFiles = async (req, res, next) => {
  try {
    const allTests = [];
    const courseId = req.params.id;
    const { id, role } = req.user;
    if (role !== 1) throw new Error('Not Authorized');
    const testFiles = await Test.find();
    testFiles.forEach(element => {
      if (courseId === element.courseId.toString()) {
        allTests.push({
          courseSessionId: courseId,
          testId: element._id,
          testFileName: element.testFileName,
          testStartDate: element.testStartDate,
          testEndDate: element.testEndDate
        });
      }
    });
    res.status(200).json({
      allTests
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

const getTestfile = async (req, res, next) => {
  try {
    const testId = req.params.testid;
    const courseId = req.params.courseid;
    const { id, role } = req.user;
    if (role !== 1) throw new Error('Not Authorized');
    const testFile = await Test.findOne({ _id: testId, courseId: courseId });
    if (!testFile) throw new Error('File does not exist');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${testFile.testFileName}"`
    );
    res.setHeader('Content-Type', testFile.testFileType);
    // Send the file data as a binary stream
    res.send(testFile.testQuestions);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

const updateTestFileDate = async (req, res, next) => {
  try {
    const testId = req.params.testid;
    const courseId = req.params.courseid;
    console.log(req.body.data);
    const { testStartDate, testEndDate } = req.body.data;
    const { id, role } = req.user;
    if (role !== 1) throw new Error('Not Authorized');
    const updateTestFile = await Test.findOneAndUpdate(
      { _id: testId, courseId: courseId },
      { testStartDate: testStartDate, testEndDate: testEndDate },
      {
        new: true,
        runValidators: true
      }
    );
    if (!updateTestFile) throw new Error('File does not exist');
    res.status(200).json({
      message: 'sucess',
      updateTestFile
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

//Might add delete file method later

module.exports = {
  creatTestFile,
  getAllTestFiles,
  getTestfile,
  updateTestFileDate
};
