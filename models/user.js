const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  firstName: { type: String, required: [true, 'Please enter your first name'] },
  lastName: { type: String, required: [true, 'Please enter your last name'] },
  email: {
    type: String,
    required: [true, 'Pleae enter your email address'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlegth: [8, 'Password should be more than 8 characters']
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    minlegth: [8, 'Password should be more than 8 characters']
  },
  role: {
    type: Number,
    required: [true, 'Please choose the role'],
    enum: [0, 1]
  }
});

//Comapre and hash passowrd and check if email is same format
userSchema.pre('save', async function(next) {
  try {
    if (!validator.isEmail(this.email)) {
      return next(new Error('Email is not valid'));
    }
    if (this.password === this.confirmPassword) {
      if (this.password.length < 8) {
        return next(new Error('Password should be more than 8 characters'));
      }
      const hashedPassword = await bcrypt.hash(
        this.password,
        process.env.SALT_ROUND * 1
      );
      const hashedConfirmPassword = await bcrypt.hash(
        this.confirmPassword,
        process.env.SALT_ROUND * 1
      );
      this.password = hashedPassword;
      this.confirmPassword = hashedConfirmPassword;
    } else {
      return next(new Error('Check your password'));
    }
    next();
  } catch (err) {
    return next(new Error('User not successfully created'));
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
