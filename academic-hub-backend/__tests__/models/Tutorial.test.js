// __tests__/models/Tutorial.test.js
const Tutorial = require('../../models/Tutorial');
const User = require('../../models/User');

describe('Tutorial Model', () => {
    /** @type {any} */
    let testUser;

    beforeEach(async () => {
        testUser = await User.create({
            name: 'Tutorial Test User',
            email: `tutorial-test-${Date.now()}@example.com`,
            password: 'password123'
        });
    });

    describe('Schema Validation', () => {
        test('should create a valid tutorial', async () => {
            const tutorialData = {
                title: 'React Tutorial for Beginners',
                channel: 'Programming with Mosh',
                duration: '1:30:45',
                url: 'https://www.youtube.com/watch?v=abc123',
                description: 'Learn React from scratch',
                user: testUser._id
            };

            const tutorial = await Tutorial.create(tutorialData);

            expect(tutorial._id).toBeDefined();
            expect(tutorial.title).toBe(tutorialData.title);
            expect(tutorial.channel).toBe(tutorialData.channel);
            expect(tutorial.duration).toBe(tutorialData.duration);
            expect(tutorial.url).toBe(tutorialData.url);
            expect(tutorial.watched).toBe(false);
        });

        test('should fail validation without required title', async () => {
            const tutorial = new Tutorial({
                channel: 'Test Channel',
                duration: '10:00',
                url: 'https://youtube.com/watch?v=test',
                user: testUser._id
            });

            let error;
            try {
                await tutorial.save();
            } catch (err) {
                error = /** @type {any} */ (err);
            }

            expect(error).toBeDefined();
            expect(error.errors.title).toBeDefined();
        });

        test('should fail validation without required channel', async () => {
            const tutorial = new Tutorial({
                title: 'Test Tutorial',
                duration: '10:00',
                url: 'https://youtube.com/watch?v=test',
                user: testUser._id
            });

            let error;
            try {
                await tutorial.save();
            } catch (err) {
                error = /** @type {any} */ (err);
            }

            expect(error).toBeDefined();
            expect(error.errors.channel).toBeDefined();
        });

        test('should fail validation without required duration', async () => {
            const tutorial = new Tutorial({
                title: 'Test Tutorial',
                channel: 'Test Channel',
                url: 'https://youtube.com/watch?v=test',
                user: testUser._id
            });

            let error;
            try {
                await tutorial.save();
            } catch (err) {
                error = /** @type {any} */ (err);
            }

            expect(error).toBeDefined();
            expect(error.errors.duration).toBeDefined();
        });

        test('should fail validation without required url', async () => {
            const tutorial = new Tutorial({
                title: 'Test Tutorial',
                channel: 'Test Channel',
                duration: '10:00',
                user: testUser._id
            });

            let error;
            try {
                await tutorial.save();
            } catch (err) {
                error = /** @type {any} */ (err);
            }

            expect(error).toBeDefined();
            expect(error.errors.url).toBeDefined();
        });

        test('should fail validation without required user', async () => {
            const tutorial = new Tutorial({
                title: 'Test Tutorial',
                channel: 'Test Channel',
                duration: '10:00',
                url: 'https://youtube.com/watch?v=test'
            });

            let error;
            try {
                await tutorial.save();
            } catch (err) {
                error = /** @type {any} */ (err);
            }

            expect(error).toBeDefined();
            expect(error.errors.user).toBeDefined();
        });

        test('should fail with title exceeding 200 characters', async () => {
            const tutorial = new Tutorial({
                title: 'A'.repeat(201),
                channel: 'Test Channel',
                duration: '10:00',
                url: 'https://youtube.com/watch?v=test',
                user: testUser._id
            });

            let error;
            try {
                await tutorial.save();
            } catch (err) {
                error = /** @type {any} */ (err);
            }

            expect(error).toBeDefined();
            expect(error.errors.title).toBeDefined();
        });

        test('should fail with description exceeding 1000 characters', async () => {
            const tutorial = new Tutorial({
                title: 'Test Tutorial',
                channel: 'Test Channel',
                duration: '10:00',
                url: 'https://youtube.com/watch?v=test',
                description: 'A'.repeat(1001),
                user: testUser._id
            });

            let error;
            try {
                await tutorial.save();
            } catch (err) {
                error = /** @type {any} */ (err);
            }

            expect(error).toBeDefined();
            expect(error.errors.description).toBeDefined();
        });
    });

    describe('URL Validation', () => {
        test('should accept valid youtube.com URL', async () => {
            const tutorial = await Tutorial.create({
                title: 'Valid URL Test',
                channel: 'Test Channel',
                duration: '10:00',
                url: 'https://www.youtube.com/watch?v=abc123',
                user: testUser._id
            });

            expect(tutorial.url).toBe('https://www.youtube.com/watch?v=abc123');
        });

        test('should accept valid youtu.be URL', async () => {
            const tutorial = await Tutorial.create({
                title: 'Valid Short URL Test',
                channel: 'Test Channel',
                duration: '10:00',
                url: 'https://youtu.be/abc123',
                user: testUser._id
            });

            expect(tutorial.url).toBe('https://youtu.be/abc123');
        });

        test('should fail with invalid URL', async () => {
            const tutorial = new Tutorial({
                title: 'Invalid URL Test',
                channel: 'Test Channel',
                duration: '10:00',
                url: 'https://vimeo.com/video123',
                user: testUser._id
            });

            let error;
            try {
                await tutorial.save();
            } catch (err) {
                error = /** @type {any} */ (err);
            }

            expect(error).toBeDefined();
            expect(error.errors.url).toBeDefined();
        });
    });

    describe('Default Values', () => {
        test('should set default watched to false', async () => {
            const tutorial = await Tutorial.create({
                title: 'Default Test',
                channel: 'Test Channel',
                duration: '10:00',
                url: 'https://youtube.com/watch?v=test',
                user: testUser._id
            });

            expect(tutorial.watched).toBe(false);
        });
    });

    describe('Updating Tutorials', () => {
        test('should mark tutorial as watched', async () => {
            const tutorial = await Tutorial.create({
                title: 'Watch Me',
                channel: 'Test Channel',
                duration: '10:00',
                url: 'https://youtube.com/watch?v=test',
                user: testUser._id
            });

            expect(tutorial.watched).toBe(false);

            tutorial.watched = true;
            await tutorial.save();

            const updatedTutorial = await Tutorial.findById(tutorial._id);
            expect(updatedTutorial?.watched).toBe(true);
        });
    });

    describe('Timestamps', () => {
        test('should have createdAt and updatedAt timestamps', async () => {
            const tutorial = await Tutorial.create({
                title: 'Timestamp Test',
                channel: 'Test Channel',
                duration: '10:00',
                url: 'https://youtube.com/watch?v=test',
                user: testUser._id
            });

            expect(tutorial.createdAt).toBeDefined();
            expect(tutorial.updatedAt).toBeDefined();
        });
    });
});
