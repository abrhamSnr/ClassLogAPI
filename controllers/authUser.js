const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

//JWT
const createAndSendJWT = (user, res) => {
  //create and send JTW
  const maxAge = 1 * 60 * 60; //1 hours in seconds
  const token = jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: maxAge
    }
  );

  //sending the token using cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: maxAge * 1000 //1 hour in ms
  });
};

const registerUser = async (req, res, next) => {
  try {
    const user = await User(req.body);
    await user.save();

    createAndSendJWT(user, res);

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

    createAndSendJWT(user, res);

    res.status(200).json({
      message: `${user.firstName} ${user.lastName} login succesfully`
    });
  } catch (err) {
    res.status(400).json({
      message: 'Login fail'
    });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    if (!req.headers.cookie) {
      return res.status(400).json({
        message: 'Not Authorized'
      });
    }
    const token = req.headers.cookie.replace('jwt=', '');
    const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);
    if (decodeToken.role !== 1) {
      return res.status(400).json({
        message: 'Not Authorized'
      });
    }
    next();
  } catch (err) {
    res.status(400).json({
      message: 'Not authorized, token not available'
    });
  }
};

module.exports = { registerUser, loginUser, adminAuth };
