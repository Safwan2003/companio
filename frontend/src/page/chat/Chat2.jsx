import React, { useState, useEffect } from 'react';
import { getCompanyEmployees } from './api';
import socketManager from './SocketManager';

const Chat2 = () => {
  const [company, setCompany] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState({});

  useEffect(() => {
    socketManager.connect();
    const socket = socketManager.getSocket();
  
    socket.on('connect', () => {
      console.log('Connected to server');
      if (selectedRecipient) {
        socket.emit('user_connected', selectedRecipient._id);
      }
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  
    socket.on('private message', ({ senderId, message }) => {
      setChatMessages(prevMessages => [...prevMessages, { senderId, message }]);
    });  

    return () => {
      socketManager.disconnect();
      socket.off('private message');
    };
  }, [selectedRecipient]);
  
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

  const handleRecipientSelect = recipient => {
    setSelectedRecipient(recipient);
    setChatMessages([]);
  };

  // const handleMessageSend = (e) => {
  //   e.preventDefault();
  //   if (newMessage.trim() === '' || !selectedRecipient) {
  //     return;
  //   }
  //   const socket = socketManager.getSocket();
  //   socket.emit('sendmessage', { recipientId: selectedRecipient._id, message: newMessage });
  //   // Use socket.id as the sender's ID
  //   setChatMessages(prevMessages => [...prevMessages, { message: newMessage, senderId: socket.id }]);
  //   setNewMessage('');
  // };







  const handleMessageSend = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedRecipient) {
      return;
    }
    const socket = socketManager.getSocket();
    const senderId = socket.id;
    const newChatMessage = { message: newMessage, senderId };
  
    // Update chat messages for sender
    
    // Update chat messages for recipient only if the selected recipient matches the sender
    // if (selectedRecipient._id === senderId) {
      //   setChatMessages(prevMessages => [...prevMessages, newChatMessage]);
      // }
      
      // Emit the message to the server
      socket.emit('sendmessage', { recipientId: selectedRecipient._id, message: newMessage });
      setChatMessages(prevMessages => [...prevMessages, newChatMessage]);
      
    setNewMessage('');
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
                onClick={() => handleRecipientSelect(company)}
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
                onClick={() => handleRecipientSelect(employee)}
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
            {chatMessages.map((message, index) => (
              <div className={message.senderId === socketManager.getSocket().id ? "flex items-start" : "flex items-end justify-end"} key={index}>
                <div className={message.senderId === socketManager.getSocket().id ? "bg-gray-300 p-3 rounded-lg" : "bg-blue-500 text-white p-3 rounded-lg"}>
                  <p className="text-sm">{message.message}</p>
                </div>
                <img className="w-8 h-8 rounded-full ml-2" src="https://via.placeholder.com/50" alt="Sender" />
              </div>
            ))}
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
