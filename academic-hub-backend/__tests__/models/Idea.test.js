// __tests__/models/Idea.test.js
const Idea = require('../../models/Idea');
const User = require('../../models/User');

describe('Idea Model', () => {
    /** @type {any} */
    let testUser;

    beforeEach(async () => {
        testUser = await User.create({
            name: 'Idea Test User',
            email: `idea-test-${Date.now()}@example.com`,
            password: 'password123'
        });
    });

    describe('Schema Validation', () => {
        test('should create a valid idea', async () => {
            const ideaData = {
                title: 'Machine Learning Project',
                content: 'Build a recommendation system using collaborative filtering',
                tags: ['ML', 'Python', 'AI'],
                category: 'project',
                user: testUser._id
            };

            const idea = await Idea.create(ideaData);

            expect(idea._id).toBeDefined();
            expect(idea.title).toBe(ideaData.title);
            expect(idea.content).toBe(ideaData.content);
            expect(idea.tags).toEqual(ideaData.tags);
            expect(idea.category).toBe('project');
        });

        test('should fail validation without required title', async () => {
            const idea = new Idea({
                content: 'Some content',
                user: testUser._id
            });

            let error;
            try {
                await idea.save();
            } catch (err) {
                error = /** @type {any} */ (err);
            }

            expect(error).toBeDefined();
            expect(error.errors.title).toBeDefined();
        });

        test('should fail validation without required content', async () => {
            const idea = new Idea({
                title: 'Test Idea',
                user: testUser._id
            });

            let error;
            try {
                await idea.save();
            } catch (err) {
                error = /** @type {any} */ (err);
            }

            expect(error).toBeDefined();
            expect(error.errors.content).toBeDefined();
        });

        test('should fail validation without required user', async () => {
            const idea = new Idea({
                title: 'Test Idea',
                content: 'Test content'
            });

            let error;
            try {
                await idea.save();
            } catch (err) {
                error = /** @type {any} */ (err);
            }

            expect(error).toBeDefined();
            expect(error.errors.user).toBeDefined();
        });

        test('should fail with title exceeding 200 characters', async () => {
            const idea = new Idea({
                title: 'A'.repeat(201),
                content: 'Test content',
                user: testUser._id
            });

            let error;
            try {
                await idea.save();
            } catch (err) {
                error = /** @type {any} */ (err);
            }

            expect(error).toBeDefined();
            expect(error.errors.title).toBeDefined();
        });

        test('should fail with content exceeding 2000 characters', async () => {
            const idea = new Idea({
                title: 'Test Idea',
                content: 'A'.repeat(2001),
                user: testUser._id
            });

            let error;
            try {
                await idea.save();
            } catch (err) {
                error = /** @type {any} */ (err);
            }

            expect(error).toBeDefined();
            expect(error.errors.content).toBeDefined();
        });
    });

    describe('Category Enum', () => {
        test('should accept study category', async () => {
            const idea = await Idea.create({
                title: 'Study Idea',
                content: 'Study content',
                category: 'study',
                user: testUser._id
            });

            expect(idea.category).toBe('study');
        });

        test('should accept project category', async () => {
            const idea = await Idea.create({
                title: 'Project Idea',
                content: 'Project content',
                category: 'project',
                user: testUser._id
            });

            expect(idea.category).toBe('project');
        });

        test('should accept research category', async () => {
            const idea = await Idea.create({
                title: 'Research Idea',
                content: 'Research content',
                category: 'research',
                user: testUser._id
            });

            expect(idea.category).toBe('research');
        });

        test('should accept general category', async () => {
            const idea = await Idea.create({
                title: 'General Idea',
                content: 'General content',
                category: 'general',
                user: testUser._id
            });

            expect(idea.category).toBe('general');
        });

        test('should fail with invalid category', async () => {
            const idea = new Idea({
                title: 'Test Idea',
                content: 'Test content',
                category: 'invalid',
                user: testUser._id
            });

            let error;
            try {
                await idea.save();
            } catch (err) {
                error = /** @type {any} */ (err);
            }

            expect(error).toBeDefined();
            expect(error.errors.category).toBeDefined();
        });
    });

    describe('Default Values', () => {
        test('should set default category to general', async () => {
            const idea = await Idea.create({
                title: 'Default Category Test',
                content: 'Testing default',
                user: testUser._id
            });

            expect(idea.category).toBe('general');
        });

        test('should set default tags to empty array', async () => {
            const idea = await Idea.create({
                title: 'Default Tags Test',
                content: 'Testing tags',
                user: testUser._id
            });

            expect(idea.tags).toEqual([]);
        });
    });

    describe('Timestamps', () => {
        test('should have createdAt and updatedAt timestamps', async () => {
            const idea = await Idea.create({
                title: 'Timestamp Test',
                content: 'Testing timestamps',
                user: testUser._id
            });

            expect(idea.createdAt).toBeDefined();
            expect(idea.updatedAt).toBeDefined();
        });
    });
});
