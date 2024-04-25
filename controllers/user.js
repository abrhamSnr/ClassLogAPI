const User = require('../models/user');

const getAllUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({
      message: 'sucess',
      user
    });
  } catch (err) {
    res.status(500);
  }
};

const registerUser = async (req, res) => {
  try {
    const user = await User(req.body);
    await user.save();
    res.status(200).json({
      message: 'sucess'
    });
  } catch (err) {
    res.status(500);
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(400).json({
        message: 'User not found'
      });
    }
    res.status(200).json({
      message: 'sucess',
      user
    });
  } catch (err) {
    res.status(500);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updateUserData = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    if (!updateUserData) {
      res.status(400).json({
        message: 'User not found'
      });
    }
    res.status(200).json({
      message: 'sucess',
      updateUserData
    });
  } catch (err) {
    res.status(500);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userDelete = await User.findByIdAndDelete(id);

    if (!userDelete) {
      res.status(400).json({
        message: 'User not found'
      });
    }

    res.status(200).json({
      message: 'User deleted'
    });
  } catch (err) {
    res.status(500);
  }
};

module.exports = { getAllUsers, registerUser, getUser, updateUser, deleteUser };
