const ErrorResponse = require('../utils/errorResponse');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc      Register user
// @route     POST /api/auth/register
// @access    Public
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Create token
  // @ts-ignore
  sendTokenResponse(user, 200, res);
});

// @desc      Login user
// @route     POST /api/auth/login
// @access    Public
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  // @ts-ignore
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // @ts-ignore
  sendTokenResponse(user, 200, res);
});

// @desc      Get current logged in user
// @route     GET /api/auth/me
// @access    Private
exports.getMe = catchAsync(async (req, res, next) => {
  // @ts-ignore
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update user details
// @route     PUT /api/auth/updatedetails
// @access    Private
exports.updateDetails = catchAsync(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(
    // @ts-ignore
    req.user.id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update password
// @route     PUT /api/auth/updatepassword
// @access    Private
exports.updatePassword = catchAsync(async (req, res, next) => {
  // @ts-ignore
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  // @ts-ignore
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  // @ts-ignore
  user.password = req.body.newPassword;
  // @ts-ignore
  await user.save();

  // @ts-ignore
  sendTokenResponse(user, 200, res);
});

// @desc      Example of Forgot Password (simplified or Stub)
// @route     POST /api/auth/forgotpassword
// @access    Public
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  // @ts-ignore
  const resetToken = user.getResetPasswordToken();

  // @ts-ignore
  await user.save({ validateBeforeSave: false });

  // In a real app, you would send an email here.
  // For now, we'll just return the token
  res.status(200).json({
    success: true,
    data: resetToken,
  });
});

// @desc      Reset password
// @route     PUT /api/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = catchAsync(async (req, res, next) => {
  const crypto = require('crypto');

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  // @ts-ignore
  user.password = req.body.password;
  // @ts-ignore
  user.resetPasswordToken = undefined;
  // @ts-ignore
  user.resetPasswordExpire = undefined;
  // @ts-ignore
  await user.save();

  // @ts-ignore
  sendTokenResponse(user, 200, res);
});

// Generate JWT Token
const generateToken = (/** @type {any} */ id) => {
  const secret = process.env.JWT_SECRET || '';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (/** @type {any} */ user, /** @type {number} */ statusCode, /** @type {any} */ res) => {
  // Create token
  // @ts-ignore
  const token = generateToken(user._id);

  const options = {
    expires: new Date(
      // @ts-ignore
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false // Default to false
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
    });
};
