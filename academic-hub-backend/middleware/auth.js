const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const catchAsync = require('../utils/catchAsync');

/**
 * Protect routes
 * @type {import('express').RequestHandler}
 */
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }
  // Set token from cookie
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const secret = process.env.JWT_SECRET || '';
    const decoded = jwt.verify(token, secret);

    // Get user from the token
    // @ts-ignore
    req.user = await User.findById(/** @type {any} */(decoded).id).select('-password');

    next();
  } catch (error) {
    // console.error('Auth Middleware Error:', error);
    return next(new ErrorResponse('Not authorized, token failed', 401));
  }
});

/**
 * Grant access to specific roles
 * @param {...string} roles
 * @returns {import('express').RequestHandler}
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // @ts-ignore
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          // @ts-ignore
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
