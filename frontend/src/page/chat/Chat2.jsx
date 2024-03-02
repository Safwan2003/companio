import React, { useState, useEffect, useRef } from 'react';
import { getCompanyEmployees, postSingleChat, getSingleChat } from './api';
import socketManager from './SocketManager';

const Chat2 = () => {
  const [company, setCompany] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderId, setSenderId] = useState(null); // State to store sender's ID
  const [selectedRoom, setSelectedRoom] = useState(null); // State to store selected room
  const messagesEndRef = useRef(null);

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
    socketManager.connect();
    const socket = socketManager.getSocket();

    socket.on('connect', () => {
      console.log('Connected to server');
      if (selectedRecipient && selectedRoom) {
        socket.emit('user_connected', { userId: senderId, room: selectedRoom }); // Emit user ID and room
      }
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('private message', ({ senderId, message }) => {
      setChatMessages(prevMessages => [...prevMessages, { senderId, message }]);
      scrollToBottom();
    });

    return () => {
      socketManager.disconnect();
      socket.off('private message');
    };
  }, [selectedRecipient, senderId, selectedRoom]);

  useEffect(() => {
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
  }, []);

  const handleRecipientSelect = async(recipient, room) => {
    // Sort senderId and recipient._id alphabetically
    const roomParticipants = [senderId, recipient._id].sort();
    const newRoom = roomParticipants.join('_');

    setSelectedRecipient(recipient);
    setSelectedRoom(newRoom); // Set selected room
    const res = await getSingleChat(recipient._id);

    setChatMessages(res.messages);
    scrollToBottom();
  };

  const handleMessageSend = async(e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedRecipient || !selectedRoom) {
      return;
    }
    try {
      const socket = socketManager.getSocket();
      await postSingleChat(selectedRecipient._id, newMessage);
      const res = await getSingleChat(selectedRecipient._id);
      setChatMessages(res.messages);
      scrollToBottom();
      socket.emit('sendmessage', { room: selectedRoom, recipientId: selectedRecipient._id, message: newMessage, senderId: senderId });
      // Note: No need to update chatMessages state here as it will be updated upon receiving the 'private message' event
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='flex h-screen'>
      <div className='w-1/3 bg-gray-100'>
        <div className="p-4">
          <h2 className="text-lg font-semibold">Users</h2>
          <ul>
            {company && (
              <li
                key={company._id}
                className={`cursor-pointer p-2 rounded-md ${selectedRecipient === company ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'}`}
                onClick={() => handleRecipientSelect(company, 'company')} // Pass room name
              >
                <div>
                  {company.name}
                  <p className="text-gray-400">(company)</p>
                </div>
              </li>
            )}
            {employees.map(employee => (
              <li
                key={employee._id}
                className={`cursor-pointer p-2 rounded-md ${selectedRecipient === employee ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'}`}
                onClick={() => handleRecipientSelect(employee, employee.name)} // Pass room name
              >
                <div>{employee.name}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col w-2/3">
        <div className="bg-gray-200 flex-grow p-4 overflow-y-auto">
          <div className="space-y-4">
            {
              chatMessages.map((message, index) => (
                <div className={message.sender === senderId ? "flex items-start" : "flex items-end justify-end"} key={index}>
                  <div className={message.sender === senderId ? "bg-gray-300 p-3 rounded-lg" : "bg-blue-500 text-white p-3 rounded-lg"}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <img className="w-8 h-8 rounded-full ml-2" src="https://via.placeholder.com/50" alt="Sender" />
                </div>
              ))
            }
            <div ref={messagesEndRef}></div>
          </div>
        </div>
        <form className="bg-gray-300 p-4 flex items-center" onSubmit={handleMessageSend}>
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full border rounded-md p-2 mr-2"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat2;
