// routes/auth.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 * name: Auth
 * description: Authentication and user management APIs
 */

/**
 * @swagger
 * /api/auth/register:
 * post:
 * summary: Register a new user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - name
 * - email
 * - password
 * properties:
 * name:
 * type: string
 * email:
 * type: string
 * password:
 * type: string
 * responses:
 * 201:
 * description: User registered successfully
 * 400:
 * description: Validation error
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Login user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 * responses:
 * 200:
 * description: Login successful
 * 401:
 * description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/me:
 * get:
 * summary: Get logged-in user
 * tags: [Auth]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: User data returned
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /api/auth/updatedetails:
 * put:
 * summary: Update user details
 * tags: [Auth]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: User details updated
 */
router.put('/updatedetails', protect, updateDetails);

/**
 * @swagger
 * /api/auth/updatepassword:
 * put:
 * summary: Update user password
 * tags: [Auth]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Password updated
 */
router.put('/updatepassword', protect, updatePassword);

/**
 * @swagger
 * /api/auth/forgotpassword:
 * post:
 * summary: Generate password reset token
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * properties:
 * email:
 * type: string
 * responses:
 * 200:
 * description: Reset token generated
 * 404:
 * description: User not found
 */
router.post('/forgotpassword', forgotPassword);

/**
 * @swagger
 * /api/auth/resetpassword/{resettoken}:
 * put:
 * summary: Reset password using token
 * tags: [Auth]
 * parameters:
 * - in: path
 * name: resettoken
 * required: true
 * schema:
 * type: string
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - password
 * properties:
 * password:
 * type: string
 * responses:
 * 200:
 * description: Password reset successful
 * 400:
 * description: Invalid or expired token
 */
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;