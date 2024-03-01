import React, { useState } from 'react';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setChatHistory([...chatHistory, { sender: 'user', message }]);
      setMessage('');
      // Here you can add logic for sending message to the backend or processing it
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`${
              chat.sender === 'user' ? 'text-right' : 'text-left'
            } mb-2`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                chat.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'
              }`}
            >
              {chat.message}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center p-2 border-t border-gray-300">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-2 mr-2 rounded border border-gray-300 focus:outline-none"
          value={message}
          onChange={handleMessageChange}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
