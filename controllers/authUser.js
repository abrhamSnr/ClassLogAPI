const User = require('../models/user');

const registerUser = async (req, res, next) => {
  try {
    const user = await User(req.body);
    await user.save();
    res.status(200).json({
      message: 'User registerd'
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

const loginUser = async (req, res, next) => {
  try {
    //Use bcrypt and jwt
    console.log('This is work for tomorrow');
  } catch (err) {
    res.status(400).json({
      message: 'Login fail'
    });
  }
};

module.exports = { registerUser, loginUser };
