const bcrypt = require('bcryptjs');
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
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email or Password is not present'
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'User not found please check your email'
      });
    }
    const comparePassowrd = await bcrypt.compare(password, user.password);
    if (!comparePassowrd) {
      return res.status(400).json({
        message: 'Login fail, Please check your email or passowrd'
      });
    }
    res.status(200).json({
      message: `${user.firstName} ${user.lastName} login succesfully`
    });
  } catch (err) {
    res.status(400).json({
      message: 'Login fail'
    });
  }
};

module.exports = { registerUser, loginUser };
