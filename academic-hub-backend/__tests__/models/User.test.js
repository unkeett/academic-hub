// __tests__/models/User.test.js
const mongoose = require('mongoose');
const User = require('../../models/User');

describe('User Model', () => {
    describe('Schema Validation', () => {
        test('should create a valid user', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };

            const user = new User(userData);
            const savedUser = await user.save();

            expect(savedUser._id).toBeDefined();
            expect(savedUser.name).toBe(userData.name);
            expect(savedUser.email).toBe(userData.email.toLowerCase());
            expect(savedUser.role).toBe('user');
        });

        test('should fail validation without required fields', async () => {
            const user = new User({});

            let error;
            try {
                await user.save();
            } catch (err) {
                error = err;
            }

            expect(error).toBeDefined();
            expect(error.errors.name).toBeDefined();
            expect(error.errors.email).toBeDefined();
            expect(error.errors.password).toBeDefined();
        });

        test('should fail validation with invalid email', async () => {
            const user = new User({
                name: 'Test User',
                email: 'invalid-email',
                password: 'password123'
            });

            let error;
            try {
                await user.save();
            } catch (err) {
                error = err;
            }

            expect(error).toBeDefined();
            expect(error.errors.email).toBeDefined();
        });

        test('should fail validation with short password', async () => {
            const user = new User({
                name: 'Test User',
                email: 'test@example.com',
                password: '12345'  // Less than 6 characters
            });

            let error;
            try {
                await user.save();
            } catch (err) {
                error = err;
            }

            expect(error).toBeDefined();
            expect(error.errors.password).toBeDefined();
        });

        test('should fail validation with name longer than 50 characters', async () => {
            const user = new User({
                name: 'A'.repeat(51),
                email: 'test@example.com',
                password: 'password123'
            });

            let error;
            try {
                await user.save();
            } catch (err) {
                error = err;
            }

            expect(error).toBeDefined();
            expect(error.errors.name).toBeDefined();
        });

        test('should enforce unique email', async () => {
            const userData = {
                name: 'Test User',
                email: 'unique@example.com',
                password: 'password123'
            };

            await User.create(userData);

            let error;
            try {
                await User.create({
                    ...userData,
                    name: 'Another User'
                });
            } catch (err) {
                error = err;
            }

            expect(error).toBeDefined();
            expect(error.code).toBe(11000); // Duplicate key error
        });
    });

    describe('Password Hashing', () => {
        test('should hash password before saving', async () => {
            const plainPassword = 'password123';
            const user = await User.create({
                name: 'Test User',
                email: 'hash-test@example.com',
                password: plainPassword
            });

            // Password should be hashed
            expect(user.password).not.toBe(plainPassword);
            expect(user.password.length).toBeGreaterThan(plainPassword.length);
        });

        test('should not rehash password if not modified', async () => {
            const user = await User.create({
                name: 'Test User',
                email: 'rehash-test@example.com',
                password: 'password123'
            });

            const originalHash = user.password;
            user.name = 'Updated Name';
            await user.save();

            expect(user.password).toBe(originalHash);
        });
    });

    describe('matchPassword Method', () => {
        test('should return true for correct password', async () => {
            const password = 'correctPassword123';
            const user = await User.create({
                name: 'Test User',
                email: 'match-test@example.com',
                password
            });

            // Need to fetch with password since password is select: false
            const userWithPassword = await User.findById(user._id).select('+password');
            const isMatch = await userWithPassword.matchPassword(password);

            expect(isMatch).toBe(true);
        });

        test('should return false for incorrect password', async () => {
            const user = await User.create({
                name: 'Test User',
                email: 'match-test2@example.com',
                password: 'correctPassword123'
            });

            const userWithPassword = await User.findById(user._id).select('+password');
            const isMatch = await userWithPassword.matchPassword('wrongPassword');

            expect(isMatch).toBe(false);
        });
    });

    describe('getResetPasswordToken Method', () => {
        test('should generate reset token', async () => {
            const user = await User.create({
                name: 'Test User',
                email: 'reset-test@example.com',
                password: 'password123'
            });

            const resetToken = user.getResetPasswordToken();

            expect(resetToken).toBeDefined();
            expect(typeof resetToken).toBe('string');
            expect(resetToken.length).toBeGreaterThan(0);
        });

        test('should set resetPasswordToken and resetPasswordExpire', async () => {
            const user = await User.create({
                name: 'Test User',
                email: 'reset-test2@example.com',
                password: 'password123'
            });

            user.getResetPasswordToken();

            expect(user.resetPasswordToken).toBeDefined();
            expect(user.resetPasswordExpire).toBeDefined();
            expect(user.resetPasswordExpire.getTime()).toBeGreaterThan(Date.now());
        });
    });

    describe('Default Values', () => {
        test('should set default role to user', async () => {
            const user = await User.create({
                name: 'Test User',
                email: 'default-test@example.com',
                password: 'password123'
            });

            expect(user.role).toBe('user');
        });

        test('should convert email to lowercase', async () => {
            const user = await User.create({
                name: 'Test User',
                email: 'TEST@EXAMPLE.COM',
                password: 'password123'
            });

            expect(user.email).toBe('test@example.com');
        });
    });
});
