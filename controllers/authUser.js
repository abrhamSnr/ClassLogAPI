const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');

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
    if (!email || !password)
      throw new Error('Email or Password is not present');

    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found please check your email');

    const comparePassowrd = await bcrypt.compare(password, user.password);
    if (!comparePassowrd)
      throw new Error('Login fail, Please check your email or passowrd');

    createAndSendJWT(user, res);

    res.status(200).json({
      message: `${user.firstName} ${user.lastName} login succesfully`
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

const requestPwdReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error('User does not exist');

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hasedToken = await bcrypt.hash(
      resetToken,
      Number(process.env.SALT_ROUND)
    );

    const expireTime = 10 * 60 * 1000; //10 min in millisecond

    const updateToken = {
      forgetPwdToken: hasedToken,
      tokenCreatedAt: Date.now(),
      tokenExpiredAt: new Date(Date.now() + expireTime)
    };

    await User.findByIdAndUpdate(user._id, updateToken, {
      new: true,
      runValidators: true
    });

    const resetLink = `${process.env.BASE_URL}/api/v1/user/passwordReset?token=${resetToken}&id=${user._id}`;
    sendEmail(
      user.email,
      'Password Reset Request',
      { name: user.firstName, link: resetLink },
      './template/requestResetPassword.handlebars'
    );

    res.status(200).json({
      message:
        'Please check your email for a message with your link to reset password'
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    if (!req.headers.cookie) throw new Error('Not Authorized');

    const token = req.headers.cookie.replace('jwt=', '');
    const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);
    if (decodeToken.role !== 1) throw new Error('Not Authorized');

    next();
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

module.exports = { registerUser, loginUser, adminAuth, requestPwdReset };
