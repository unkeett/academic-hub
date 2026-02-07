// __tests__/models/Goal.test.js
const mongoose = require('mongoose');
const Goal = require('../../models/Goal');
const User = require('../../models/User');

describe('Goal Model', () => {
    let testUser;

    beforeEach(async () => {
        testUser = await User.create({
            name: 'Goal Test User',
            email: `goal-test-${Date.now()}@example.com`,
            password: 'password123'
        });
    });

    describe('Schema Validation', () => {
        test('should create a valid goal', async () => {
            const goalData = {
                text: 'Complete calculus course',
                description: 'Finish all chapters by end of month',
                priority: 'high',
                dueDate: new Date('2026-03-01'),
                user: testUser._id
            };

            const goal = await Goal.create(goalData);

            expect(goal._id).toBeDefined();
            expect(goal.text).toBe(goalData.text);
            expect(goal.description).toBe(goalData.description);
            expect(goal.priority).toBe('high');
            expect(goal.completed).toBe(false);
        });

        test('should fail validation without required text', async () => {
            const goal = new Goal({
                description: 'Test description',
                user: testUser._id
            });

            let error;
            try {
                await goal.save();
            } catch (err) {
                error = err;
            }

            expect(error).toBeDefined();
            expect(error.errors.text).toBeDefined();
        });

        test('should fail validation without required user', async () => {
            const goal = new Goal({
                text: 'Test Goal'
            });

            let error;
            try {
                await goal.save();
            } catch (err) {
                error = err;
            }

            expect(error).toBeDefined();
            expect(error.errors.user).toBeDefined();
        });

        test('should fail with text exceeding 200 characters', async () => {
            const goal = new Goal({
                text: 'A'.repeat(201),
                user: testUser._id
            });

            let error;
            try {
                await goal.save();
            } catch (err) {
                error = err;
            }

            expect(error).toBeDefined();
            expect(error.errors.text).toBeDefined();
        });

        test('should fail with description exceeding 500 characters', async () => {
            const goal = new Goal({
                text: 'Test Goal',
                description: 'A'.repeat(501),
                user: testUser._id
            });

            let error;
            try {
                await goal.save();
            } catch (err) {
                error = err;
            }

            expect(error).toBeDefined();
            expect(error.errors.description).toBeDefined();
        });

        test('should fail with invalid priority value', async () => {
            const goal = new Goal({
                text: 'Test Goal',
                priority: 'invalid',
                user: testUser._id
            });

            let error;
            try {
                await goal.save();
            } catch (err) {
                error = err;
            }

            expect(error).toBeDefined();
            expect(error.errors.priority).toBeDefined();
        });
    });

    describe('Priority Enum', () => {
        test('should accept low priority', async () => {
            const goal = await Goal.create({
                text: 'Low Priority Goal',
                priority: 'low',
                user: testUser._id
            });

            expect(goal.priority).toBe('low');
        });

        test('should accept medium priority', async () => {
            const goal = await Goal.create({
                text: 'Medium Priority Goal',
                priority: 'medium',
                user: testUser._id
            });

            expect(goal.priority).toBe('medium');
        });

        test('should accept high priority', async () => {
            const goal = await Goal.create({
                text: 'High Priority Goal',
                priority: 'high',
                user: testUser._id
            });

            expect(goal.priority).toBe('high');
        });
    });

    describe('Default Values', () => {
        test('should set default completed to false', async () => {
            const goal = await Goal.create({
                text: 'Test Goal',
                user: testUser._id
            });

            expect(goal.completed).toBe(false);
        });

        test('should set default priority to medium', async () => {
            const goal = await Goal.create({
                text: 'Test Goal',
                user: testUser._id
            });

            expect(goal.priority).toBe('medium');
        });
    });

    describe('Timestamps', () => {
        test('should have createdAt and updatedAt timestamps', async () => {
            const goal = await Goal.create({
                text: 'Timestamp Test',
                user: testUser._id
            });

            expect(goal.createdAt).toBeDefined();
            expect(goal.updatedAt).toBeDefined();
        });
    });

    describe('Updating Goals', () => {
        test('should mark goal as completed', async () => {
            const goal = await Goal.create({
                text: 'Complete Me',
                user: testUser._id
            });

            expect(goal.completed).toBe(false);

            goal.completed = true;
            await goal.save();

            const updatedGoal = await Goal.findById(goal._id);
            expect(updatedGoal.completed).toBe(true);
        });
    });
});
