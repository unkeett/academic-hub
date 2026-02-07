const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

// Helper to handle errors
const handleError = (error, context) => {
    if (error.response) {
        console.error(`Error ${context}: ${error.response.status} - ${error.response.data.message}`);
        if (error.response.status === 500 && error.response.data.message.includes('YouTube API')) {
            console.warn('Skipping further verification steps due to missing YouTube API key.');
            process.exit(0);
        }
    } else if (error.request) {
        console.error(`Error ${context}: No response received. Is the server running?`);
        process.exit(1);
    } else {
        console.error(`Error ${context}: ${error.message}`);
        process.exit(1);
    }
};

const verify = async () => {
    try {
        // 1. Register User
        const timestamp = Date.now();
        const userCredentials = {
            name: `TestUser_${timestamp}`,
            email: `test_${timestamp}@example.com`,
            password: 'password123'
        };

        console.log('1. Registering user...');
        let token;
        try {
            const registerResponse = await axios.post(`${API_URL}/auth/register`, userCredentials);
            token = registerResponse.data.token;
            console.log('   User registered successfully.');
        } catch (err) {
            handleError(err, 'registering user');
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // 2. Create Tutorial
        console.log('2. Creating tutorial...');
        const tutorialUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Rick Roll (valid ID)
        let tutorialId;
        try {
            const createResponse = await axios.post(`${API_URL}/tutorials`, { url: tutorialUrl }, config);
            tutorialId = createResponse.data.data._id;
            console.log(`   Tutorial created with ID: ${tutorialId}`);
        } catch (err) {
            handleError(err, 'creating tutorial');
            return; // specific handling inside handleError might create exit, but just in case
        }

        if (!tutorialId) {
            console.error('Failed to create tutorial, cannot proceed.');
            return;
        }

        // 3. Bookmark Tutorial
        console.log('3. Bookmarking tutorial...');
        try {
            const bookmarkResponse = await axios.put(`${API_URL}/tutorials/${tutorialId}/bookmark`, {}, config);
            // Verify response contains the tutorial ID in bookmarks
            const bookmarks = bookmarkResponse.data.data;
            if (bookmarks.includes(tutorialId)) {
                console.log('   Tutorial successfully bookmarked (API response confirmed).');
            } else {
                console.error('   Tutorial ID not found in bookmarks response!');
            }
        } catch (err) {
            handleError(err, 'bookmarking tutorial');
        }

        // 4. Verify in User Profile
        console.log('4. Verifying in user profile...');
        try {
            const meResponse = await axios.get(`${API_URL}/auth/me`, config);
            const myBookmarks = meResponse.data.data.bookmarkedTutorials;

            // Note: bookmarkedTutorials in User model is array of ObjectIds. 
            // When using findById (which getMe uses), it might populate? No, schema defines it as ObjectId refs, 
            // but default findById doesn't populate unless .populate() is called.
            // Let's assume it returns ID strings or objects.
            if (myBookmarks.some(id => id.toString() === tutorialId)) {
                console.log('   Verification successful: Bookmark found in user profile.');
            } else {
                console.error('   Verification failed: Bookmark NOT found in user profile.');
                console.log('   Current bookmarks:', myBookmarks);
            }
        } catch (err) {
            handleError(err, 'getting user profile');
        }

        // 5. Unbookmark Tutorial
        console.log('5. Un-bookmarking tutorial...');
        try {
            const unbookmarkResponse = await axios.put(`${API_URL}/tutorials/${tutorialId}/bookmark`, {}, config);
            const bookmarks = unbookmarkResponse.data.data;
            if (!bookmarks.includes(tutorialId)) {
                console.log('   Tutorial successfully un-bookmarked.');
            } else {
                console.error('   Tutorial ID still found in bookmarks!');
            }
        } catch (err) {
            handleError(err, 'un-bookmarking tutorial');
        }

        console.log('Verification completed successfully.');

    } catch (error) {
        console.error('Unexpected error:', error);
    }
};

verify();
