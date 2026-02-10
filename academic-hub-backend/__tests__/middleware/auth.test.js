// __tests__/middleware/auth.test.js
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { protect, authorize } = require('../../middleware/auth');
const User = require('../../models/User');

// Mock request, response, and next
const mockRequest = (options = {}) => ({
    headers: options.headers || {},
    user: options.user || null
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = jest.fn();

describe('Auth Middleware', () => {
    describe('protect middleware', () => {
        beforeEach(() => {
            mockNext.mockClear();
        });

        test('should fail with no authorization header', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await protect(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Not authorized, no token'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should fail with invalid token format', async () => {
            const req = mockRequest({
                headers: { authorization: 'InvalidFormat token123' }
            });
            const res = mockResponse();

            await protect(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should fail with invalid token', async () => {
            const req = mockRequest({
                headers: { authorization: 'Bearer invalidtoken123' }
            });
            const res = mockResponse();

            await protect(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Not authorized, token failed'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should authenticate with valid token', async () => {
            // Create a user
            const user = await User.create({
                name: 'Middleware Test User',
                email: 'middleware-test@example.com',
                password: 'password123'
            });

            // Generate token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

            const req = mockRequest({
                headers: { authorization: `Bearer ${token}` }
            });
            const res = mockResponse();

            await protect(req, res, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(req.user).toBeDefined();
            expect(req.user.email).toBe('middleware-test@example.com');
        });

        test('should fail if user not found for valid token', async () => {
            // Generate token for non-existent user
            const fakeId = new mongoose.Types.ObjectId();
            const token = jwt.sign({ id: fakeId }, process.env.JWT_SECRET);

            const req = mockRequest({
                headers: { authorization: `Bearer ${token}` }
            });
            const res = mockResponse();

            await protect(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Not authorized, user not found'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should fail with expired token', async () => {
            const user = await User.create({
                name: 'Expired Token User',
                email: 'expired-test@example.com',
                password: 'password123'
            });

            // Generate expired token
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '-1s' }
            );

            const req = mockRequest({
                headers: { authorization: `Bearer ${token}` }
            });
            const res = mockResponse();

            await protect(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Not authorized, token failed'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('authorize middleware', () => {
        test('should allow access for authorized role', () => {
            const req = mockRequest({
                user: { role: 'admin' }
            });
            const res = mockResponse();

            const middleware = authorize('admin', 'user');
            middleware(req, res, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        test('should deny access for unauthorized role', () => {
            const req = mockRequest({
                user: { role: 'user' }
            });
            const res = mockResponse();

            const middleware = authorize('admin');
            middleware(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'User role user is not authorized to access this route'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should allow when role matches any of multiple allowed roles', () => {
            const req = mockRequest({
                user: { role: 'user' }
            });
            const res = mockResponse();

            const middleware = authorize('admin', 'user', 'moderator');
            middleware(req, res, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });
});
