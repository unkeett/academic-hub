// __tests__/models/Subject.test.js
const mongoose = require('mongoose');
const Subject = require('../../models/Subject');
const User = require('../../models/User');

describe('Subject Model', () => {
    let testUser;

    beforeEach(async () => {
        testUser = await User.create({
            name: 'Subject Test User',
            email: `subject-test-${Date.now()}@example.com`,
            password: 'password123'
        });
    });

    describe('Schema Validation', () => {
        test('should create a valid subject', async () => {
            const subjectData = {
                name: 'Mathematics',
                description: 'Advanced calculus and algebra',
                topics: ['Calculus', 'Algebra', 'Geometry'],
                user: testUser._id
            };

            const subject = await Subject.create(subjectData);

            expect(subject._id).toBeDefined();
            expect(subject.name).toBe(subjectData.name);
            expect(subject.description).toBe(subjectData.description);
            expect(subject.topics).toEqual(subjectData.topics);
            expect(subject.completedTopics).toBe(0);
            expect(subject.color).toBe('#3B82F6');
        });

        test('should fail validation without required name', async () => {
            const subject = new Subject({
                description: 'Test description',
                user: testUser._id
            });

            let error;
            try {
                await subject.save();
            } catch (err) {
                error = err;
            }

            expect(error).toBeDefined();
            expect(error.errors.name).toBeDefined();
        });

        test('should fail validation without required user', async () => {
            const subject = new Subject({
                name: 'Test Subject'
            });

            let error;
            try {
                await subject.save();
            } catch (err) {
                error = err;
            }

            expect(error).toBeDefined();
            expect(error.errors.user).toBeDefined();
        });

        test('should fail with name exceeding 100 characters', async () => {
            const subject = new Subject({
                name: 'A'.repeat(101),
                user: testUser._id
            });

            let error;
            try {
                await subject.save();
            } catch (err) {
                error = err;
            }

            expect(error).toBeDefined();
            expect(error.errors.name).toBeDefined();
        });

        test('should fail with description exceeding 500 characters', async () => {
            const subject = new Subject({
                name: 'Test Subject',
                description: 'A'.repeat(501),
                user: testUser._id
            });

            let error;
            try {
                await subject.save();
            } catch (err) {
                error = err;
            }

            expect(error).toBeDefined();
            expect(error.errors.description).toBeDefined();
        });
    });

    describe('Default Values', () => {
        test('should set default completedTopics to 0', async () => {
            const subject = await Subject.create({
                name: 'Test Subject',
                user: testUser._id
            });

            expect(subject.completedTopics).toBe(0);
        });

        test('should set default color to #3B82F6', async () => {
            const subject = await Subject.create({
                name: 'Test Subject',
                user: testUser._id
            });

            expect(subject.color).toBe('#3B82F6');
        });

        test('should set default topics to empty array', async () => {
            const subject = await Subject.create({
                name: 'Test Subject',
                user: testUser._id
            });

            expect(subject.topics).toEqual([]);
        });
    });

    describe('Timestamps', () => {
        test('should have createdAt and updatedAt timestamps', async () => {
            const subject = await Subject.create({
                name: 'Timestamp Test',
                user: testUser._id
            });

            expect(subject.createdAt).toBeDefined();
            expect(subject.updatedAt).toBeDefined();
        });
    });
});
