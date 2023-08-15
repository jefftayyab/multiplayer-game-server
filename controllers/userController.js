const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { createToken } = require("../helpers/tokenHelper");

// @desc    Create new user or get existing user if user already exists in single API call
// @route   POST /user/create
// @access  Public
const createUser = asyncHandler(async (req, res) => {
  let token;

  const { email, userName, textImage } = req.fields;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    token = createToken(existingUser._id);
    return res.status(201).json({ success: true, data: { ...existingUser._doc, token } });
  }
  const user = await User.create({ email, userName, textImage });

  token = createToken(user._id);

  return res.status(200).json({ success: true, data: { ...user._doc, token } });
});

// @desc    Get user profile
// @route   POST /user/
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  return res.status(200).json({ success: true, data: req.user });
});

// @desc    Update user profile
// @route   POST /user/update
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate({ _id: req.user._id }, req.fields, { new: true });
  return res.status(200).json({ success: true, data: user });
});

module.exports = { createUser, getProfile, updateProfile };
