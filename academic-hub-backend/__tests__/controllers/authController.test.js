// __tests__/controllers/authController.test.js
const express = require('express');
const request = require('supertest');
const User = require('../../models/User');

// Create a mini Express app for testing
const createTestApp = () => {
    const app = express();
    app.use(express.json());

    // Mock the routes
    const authRoutes = require('../../routes/auth');
    app.use('/api/auth', authRoutes);

    // Error handler
    const errorHandler = require('../../middleware/error');
    app.use(errorHandler);

    return app;
};

describe('Auth Controller', () => {
    let app;

    beforeAll(() => {
        app = createTestApp();
    });

    describe('POST /api/auth/register', () => {
        test('should register a new user successfully', async () => {
            const userData = {
                name: 'Test User',
                email: 'register-test@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeDefined();
            expect(response.body.data).toBeDefined();
            expect(response.body.data.email).toBe(userData.email);
            expect(response.body.data.name).toBe(userData.name);

            // Verify user was created in database
            const user = await User.findOne({ email: userData.email });
            expect(user).toBeTruthy();
        });

        test('should fail with missing name', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('name');
        });

        test('should fail with missing email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    password: 'password123'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('email');
        });

        test('should fail with missing password', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('password');
        });

        test('should fail with short password', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'short-pass@example.com',
                    password: '12345'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('6 characters');
        });

        test('should fail with duplicate email', async () => {
            const userData = {
                name: 'First User',
                email: 'duplicate@example.com',
                password: 'password123'
            };

            // Create first user
            await request(app).post('/api/auth/register').send(userData);

            // Try to create second user with same email
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Second User',
                    email: 'duplicate@example.com',
                    password: 'password456'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('exists');
        });
    });

    describe('POST /api/auth/login', () => {
        const testUser = {
            name: 'Login Test User',
            email: 'login-test@example.com',
            password: 'password123'
        };

        beforeEach(async () => {
            await User.create(testUser);
        });

        test('should login successfully with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeDefined();
            expect(response.body.data.email).toBe(testUser.email);
        });

        test('should fail with missing email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    password: 'password123'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('email');
        });

        test('should fail with missing password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('password');
        });

        test('should fail with invalid email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Invalid credentials');
        });

        test('should fail with wrong password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Invalid credentials');
        });
    });

    describe('GET /api/auth/me', () => {
        test('should get current user with valid token', async () => {
            // Create user and get token
            const userData = {
                name: 'Me Test User',
                email: 'me-test@example.com',
                password: 'password123'
            };

            const registerResponse = await request(app)
                .post('/api/auth/register')
                .send(userData);

            const token = registerResponse.body.token;

            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe(userData.email);
            expect(response.body.data.name).toBe(userData.name);
        });

        test('should fail without token', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Not authorized');
        });

        test('should fail with invalid token', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /api/auth/updatedetails', () => {
        let token;

        beforeEach(async () => {
            const userData = {
                name: 'Update Test User',
                email: 'update-test@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData);

            token = response.body.token;
        });

        test('should update user details', async () => {
            const updates = {
                name: 'Updated Name',
                email: 'updated-email@example.com'
            };

            const response = await request(app)
                .put('/api/auth/updatedetails')
                .set('Authorization', `Bearer ${token}`)
                .send(updates)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe(updates.name);
            expect(response.body.data.email).toBe(updates.email);
        });

        test('should fail without authentication', async () => {
            const response = await request(app)
                .put('/api/auth/updatedetails')
                .send({ name: 'New Name' })
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /api/auth/updatepassword', () => {
        let token;
        const originalPassword = 'password123';

        beforeEach(async () => {
            const userData = {
                name: 'Password Test User',
                email: 'password-test@example.com',
                password: originalPassword
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData);

            token = response.body.token;
        });

        test('should update password with correct current password', async () => {
            const response = await request(app)
                .put('/api/auth/updatepassword')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    currentPassword: originalPassword,
                    newPassword: 'newPassword456'
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeDefined();
        });

        test('should fail with incorrect current password', async () => {
            const response = await request(app)
                .put('/api/auth/updatepassword')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    currentPassword: 'wrongPassword',
                    newPassword: 'newPassword456'
                })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('incorrect');
        });
    });

    describe('POST /api/auth/forgotpassword', () => {
        beforeEach(async () => {
            await User.create({
                name: 'Forgot Test User',
                email: 'forgot-test@example.com',
                password: 'password123'
            });
        });

        test('should generate reset token for existing user', async () => {
            const response = await request(app)
                .post('/api/auth/forgotpassword')
                .send({ email: 'forgot-test@example.com' })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.resetUrl).toBeDefined();
        });

        test('should fail without email', async () => {
            const response = await request(app)
                .post('/api/auth/forgotpassword')
                .send({})
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        test('should fail for non-existent user', async () => {
            const response = await request(app)
                .post('/api/auth/forgotpassword')
                .send({ email: 'nonexistent@example.com' })
                .expect(404);

            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /api/auth/resetpassword/:resettoken', () => {
        let resetToken;

        beforeEach(async () => {
            const user = await User.create({
                name: 'Reset Test User',
                email: 'reset-test@example.com',
                password: 'password123'
            });

            resetToken = user.getResetPasswordToken();
            await user.save({ validateBeforeSave: false });
        });

        test('should reset password with valid token', async () => {
            const response = await request(app)
                .put(`/api/auth/resetpassword/${resetToken}`)
                .send({ password: 'newPassword456' })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('successful');
        });

        test('should fail with invalid token', async () => {
            const response = await request(app)
                .put('/api/auth/resetpassword/invalidtoken')
                .send({ password: 'newPassword456' })
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        test('should fail without new password', async () => {
            const response = await request(app)
                .put(`/api/auth/resetpassword/${resetToken}`)
                .send({})
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });
});
