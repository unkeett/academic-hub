// __tests__/middleware/error.test.js
const errorHandler = require('../../middleware/error');

// Mock request, response, and next
const mockRequest = () => ({});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = jest.fn();

describe('Error Middleware', () => {
    test('should handle generic error with default 500 status', () => {
        const err = new Error('Something went wrong');
        const req = mockRequest();
        const res = mockResponse();

        errorHandler(err, req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Something went wrong'
        });
    });

    test('should handle error with custom status code', () => {
        /** @type {any} */
        const err = new Error('Not Found');
        err.statusCode = 404;
        const req = mockRequest();
        const res = mockResponse();

        errorHandler(err, req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Not Found'
        });
    });

    test('should handle CastError (Mongoose bad ObjectId)', () => {
        /** @type {any} */
        const err = new Error('Cast to ObjectId failed');
        err.name = 'CastError';
        const req = mockRequest();
        const res = mockResponse();

        errorHandler(err, req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Resource not found'
        });
    });

    test('should handle duplicate key error (code 11000)', () => {
        /** @type {any} */
        const err = new Error('Duplicate field value');
        err.code = 11000;
        const req = mockRequest();
        const res = mockResponse();

        errorHandler(err, req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Duplicate field value entered'
        });
    });

    test('should handle Mongoose validation error', () => {
        /** @type {any} */
        const err = new Error('Validation failed');
        err.name = 'ValidationError';
        err.errors = {
            name: { message: 'Name is required' },
            email: { message: 'Email is invalid' }
        };
        const req = mockRequest();
        const res = mockResponse();

        errorHandler(err, req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: ['Name is required', 'Email is invalid']
        });
    });

    test('should default to "Server Error" if no message provided', () => {
        const err = {};
        const req = mockRequest();
        const res = mockResponse();

        errorHandler(err, req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Server Error'
        });
    });
});
