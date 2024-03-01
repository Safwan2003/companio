import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import { getCompanyEmployees, postSingleChat, getSingleChat } from './api';

const Chat = () => {
  const [messageInput, setMessageInput] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [company, setCompany] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [singleChatMessages, setSingleChatMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [senderId, setSenderId] = useState(null); // State for sender ID

  useEffect(() => {
    // Function to connect to socket
    const connectToSocket = () => {
      const socket = io('http://localhost:2000');
      // const socket = useMemo(()=> io('http://localhost:2000'),[]);

      socket.on('connect', () => {
        console.log('Connected to server');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      socket.on('newMessage', handleNewMessage);

      setSocket(socket);
    };

    // Connect to socket
    connectToSocket();

    // Cleanup function
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Function to decode user ID from token
    const decodeUserIdFromToken = (token) => {
      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error('Invalid JWT format');
        }

        const decoded = JSON.parse(atob(parts[1]));
        return decoded.user.id;
      } catch (error) {
        console.error('Error decoding JWT:', error.message);
        return null;
      }
    };

    // Function to fetch sender ID
    const fetchSenderId = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const id = decodeUserIdFromToken(token);
        setSenderId(id);
        console.log("senderId: ", id);
        return id; // Return the sender ID
      } catch (error) {
        console.error('Error fetching sender data:', error);
        throw error; // Throw error to be caught by the caller
      }
    };

    // Use fetchSenderId directly inside the useEffect
    fetchSenderId()
      .then(id => setSenderId(id))
      .catch(error => console.error('Error setting sender ID:', error));
  }, []);

  useEffect(() => {
    if (!socket || !selectedRecipient) return;
    socket.emit('setup', { _id: selectedRecipient._id });

    const fetchData = async () => {
      try {
        const recipientId = selectedRecipient._id;
        const data = await getSingleChat(recipientId);
        setSingleChatMessages(data.messages);
      } catch (error) {
        console.error('Error fetching single chat messages:', error);
      }
    };

    fetchData();
  }, [socket, selectedRecipient]);

  useEffect(() => {
    if (!socket) return;

    const fetchUsers = async () => {
      try {
        const userData = await getCompanyEmployees();
        if (userData.company) {
          setCompany(userData.company);
        }
        if (Array.isArray(userData.colleagues)) {
          setEmployees(userData.colleagues);
        } else {
          console.error('Error: Expected an array of users, but received:', userData.colleagues);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [socket]);

  const handleRecipientSelect = (recipient) => {
    setSelectedRecipient(recipient);
  };

  const handleMessageChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!selectedRecipient) {
      alert('Please select a user to send a message');
      return;
    }

    const recipientId = selectedRecipient._id;
    const message = messageInput.trim();

    if (message === '') {
      alert('Please enter a message');
      return;
    }

    try {
      await postSingleChat(recipientId, message);
      setMessageInput('');

      // Emit the new message event with the sender ID
      socket.emit('newMessage', { senderId, recipientId, message });

      const data = await getSingleChat(recipientId);
      setSingleChatMessages(data.messages);

      const sentMessage = { senderId, recipientId, message };
      setSingleChatMessages(prevMessages => [...prevMessages, sentMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleNewMessage = (newMessage) => {
    setSingleChatMessages(prevMessages => [...prevMessages, newMessage]);
  };

  // Listener for incoming messages from the server
  useEffect(() => {
    if (!socket) return;

    const messageReceivedListener = (receivedMessage) => {
      // Update the UI with the received message
      setSingleChatMessages(prevMessages => [...prevMessages, receivedMessage]);
    };

    // Add listener for 'messageReceived' event
    socket.on('messageReceived', messageReceivedListener);

    // Clean up the listener when component unmounts
    return () => {
      socket.off('messageReceived', messageReceivedListener);
    };
  }, [socket]);

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Employees and Company</h2>
        <ul>
          {company && (
            <li
              key={company._id}
              className={`cursor-pointer p-2 rounded-md ${selectedRecipient === company ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'}`}
              onClick={() => handleRecipientSelect(company)}
            >
              <div>
                {company.name}
                <p className="text-gray-400">(company)</p>
              </div>
            </li>
          )}
          {employees.map((employee) => (
            <li
              key={employee._id}
              className={`cursor-pointer p-2 rounded-md ${selectedRecipient === employee ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'}`}
              onClick={() => handleRecipientSelect(employee)}
            >
              <div>{employee.name}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-4">
        {selectedRecipient ? (
          <div className="flex flex-col h-full">
            <div className="bg-white rounded-lg shadow-md p-4 flex-1 mb-4 overflow-y-auto">
              {singleChatMessages.map((msg, index) => {
                const isSender = msg.sender === selectedRecipient._id;
                const bgColor = isSender ? 'bg-blue-400' : 'bg-orange-400';
                const textColor = isSender ? 'text-white' : 'text-black';

                return (
                  <div key={index} className={`${isSender ? 'text-left' : 'text-right'} mb-2`}>
                    <div className={`inline-block p-2 rounded-lg ${bgColor} ${textColor}`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center">
              <textarea
                rows="3"
                className="flex-1 p-2 mr-2 rounded border border-gray-300 focus:outline-none resize-none"
                placeholder="Type your message..."
                value={messageInput}
                onChange={handleMessageChange}
              ></textarea>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none ml-2"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4 flex justify-center items-center h-full">
            <p className="text-gray-500">Select an employee or the company to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
