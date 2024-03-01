const Message = require('../models/message');

exports.sendMessage = async (req, res) => {
  try {
    const { recipient, content } = req.body; // Ensure recipient and content are extracted correctly
    const senderId = req.user.id;

    if (!recipient || !content) {
      return res.status(400).json({ success: false, error: 'Recipient and content are required' });
    }

    const message = new Message({ sender: senderId, recipient, content }); // Use recipient directly
    await message.save();

    // No need to mark the message as read on send
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
};




exports.getMessages = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const userId = req.user.id;

    let messages = await Message.find({
      $or: [
        { sender: userId, recipient: recipientId },
        { sender: recipientId, recipient: userId }
      ]
    }).sort({ createdAt: 1 });

    // Mark messages as read by the recipient
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (message.recipient.toString() === userId && !message.readBy.includes(userId)) {
        message.readBy.push(userId);
        await message.save(); // Save the message after modification
      }
    }

    res.json({ success: true, messages, message: 'Messages retrieved successfully' });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
};
