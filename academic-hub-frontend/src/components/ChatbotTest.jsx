// Test file to verify chatbot integration
// This file can be deleted after testing

import React from 'react';
import Chatbot from '../components/Chatbot';

const ChatbotTest = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Chatbot Integration Test</h1>
      <p>The chatbot should appear as a floating button in the bottom-right corner.</p>
      <p>Click it to test the chat functionality.</p>
      
      {/* The chatbot will be rendered by App.js, this is just for testing */}
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px',
        background: '#f0f0f0',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#666'
      }}>
        Chatbot should be here →
      </div>
    </div>
  );
};

export default ChatbotTest;