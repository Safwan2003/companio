// Import necessary modules
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import robotImage from '../assets/robot.png'

// Define the Chatbot component
const Chatbot = () => {
  // State variables to manage message input and chat history
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // useEffect hook to send a welcome message when the component mounts
  useEffect(() => {
    const welcomeMessage = "Welcome to Mr. Helper!";
    setChatHistory([{ sender: 'bot', message: welcomeMessage }]);
  }, []);

  // Function to handle changes in the message input
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      setChatHistory([...chatHistory, { sender: 'user', message }]);
      setMessage('');

      try {
        // Make a POST request to the backend with the user message
        const response = await axios.post('http://localhost:2000/aibot', {
          message: message
        });

        // Get the response from the backend and add it to the chat history
        const botMessage = response.data.message;
        setChatHistory([...chatHistory, { sender: 'bot', message: botMessage }]);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // Function to handle key press events (e.g., pressing Enter to send a message)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Render the Chatbot component
  return (
    <div className="flex flex-col max-h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`flex mb-4 ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {chat.sender === 'bot' && (
              <img
                src={robotImage}
                alt="Mr. Helper"
                className="h-8 w-8 mr-2 rounded-full"
              />
            )}
            <div
              className={`rounded-lg px-4 py-2 ${chat.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
            >
              {chat.message}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-300">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-3 mr-4 rounded border border-gray-300 focus:outline-none"
          value={message}
          onChange={handleMessageChange}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSendMessage}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          Send
        </button>
      </div>
    </div>
  );
};

// Export the Chatbot component
export default Chatbot;
