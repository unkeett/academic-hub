# AI Chatbot Setup Instructions

## Backend Environment Variable

To enable the AI chatbot functionality, you need to add the Grok xAI API key to your backend environment variables.

### Step 1: Get Grok xAI API Key
1. Visit [x.ai](https://x.ai) and create an account
2. Navigate to the API section and generate an API key
3. Copy the API key

### Step 2: Add to Backend .env File
Add the following line to your `academic-hub-backend/.env` file:

```env
GROK_API_KEY=your_grok_api_key_here
```

Replace `your_grok_api_key_here` with your actual Grok xAI API key.

### Step 3: Restart Backend Server
After adding the API key, restart your backend server:

```bash
cd academic-hub-backend
npm run dev
```

## Features Implemented

✅ **Frontend Features:**
- Floating chat icon (bottom-right corner)
- Smooth slide-up/down animations
- Responsive design for mobile and desktop
- Message history with user (blue/right) and AI (green/left) styling
- Loading state with "AI is thinking..." animation
- Enter key to send, Shift+Enter for new line
- Chat history persistence in localStorage
- Clear chat functionality

✅ **Backend Features:**
- `/api/chat` POST endpoint
- Grok xAI API integration with 'grok-beta' model
- Conversation history context maintenance
- Proper error handling and responses
- Secure API key handling (no keys exposed to frontend)

✅ **Integration:**
- Added to main App.jsx with z-index 9999
- Uses existing axios configuration
- No CORS issues (backend proxy)
- Production-ready with error handling

## Usage

1. The chatbot icon appears in the bottom-right corner of all pages
2. Click the icon to open/close the chat window
3. Type messages and press Enter to send
4. Chat history is automatically saved and restored
5. Use the trash icon to clear chat history

## Testing

The chatbot is ready to use once the `GROK_API_KEY` is added to the backend environment variables. It will:
- Maintain conversation context
- Show loading states during API calls
- Handle errors gracefully
- Work responsively on all screen sizes
- Persist chat history across sessions