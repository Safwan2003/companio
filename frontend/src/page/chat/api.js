import axios from 'axios';
import { io } from 'socket.io-client'; // Import the socket client

const socket = io('http://localhost:2000'); 
export const postSingleChat = async (recipientId, content) => {
  try {
    const token = localStorage.getItem('authToken');

    const res = await axios.post(
      'http://localhost:2000/api/singlechat',
      { recipient: recipientId, content }, // Ensure recipient is passed as recipientId
      {
        headers: {
          Authorization: token
        }
      }
    );
    
    // await socket.emit('newMessage', { sender: senderId, recipient: recipientId, message: content });
    // console.log(res)
    return res.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getSingleChat = async (recipientId) => {
  try {
    const token = localStorage.getItem('authToken');

    const res = await axios.get(
      `http://localhost:2000/api/singlechat/${recipientId}`,
      {
        headers: {
          Authorization: token
        }
      }
    );
// console.log(res.data)
    return res.data;
  } catch (error) {
    console.error('Error fetching single chat messages:', error);
    throw error;
  }
};

export const getCompanyEmployees = async () => {
  try {
    const token = localStorage.getItem('authToken');

    const res = await axios.get('http://localhost:2000/api/getusersforchat', {
      headers: {
        Authorization: token
      }
    });

    if (!Array.isArray(res.data.colleagues)) {
      console.error('Error: Expected an array of users, but received:', res.data.colleagues);
      throw new Error('Invalid data received from server');
    }

    return res.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};
