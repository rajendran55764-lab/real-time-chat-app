const Message = require('../models/Message');
const User = require('../models/User');

module.exports = (io) => {
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('userOnline', async (userId) => {
      onlineUsers.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, { status: 'online' });
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    });

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
      console.log(`User left room: ${roomId}`);
    });

    socket.on('sendMessage', async (data) => {
      try {
        const { roomId, content, senderId, senderName } = data;
        const message = new Message({
          room: roomId,
          sender: senderId,
          senderName,
          content,
          type: 'text'
        });
        await message.save();
        io.to(roomId).emit('newMessage', {
          _id: message._id,
          room: roomId,
          sender: senderId,
          senderName,
          content,
          createdAt: message.createdAt
        });
      } catch (err) {
        console.log('Error saving message:', err);
      }
    });

    socket.on('typing', (data) => {
      socket.to(data.roomId).emit('userTyping', {
        username: data.username,
        isTyping: data.isTyping
      });
    });

    socket.on('disconnect', async () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          await User.findByIdAndUpdate(userId, {
            status: 'offline',
            lastSeen: Date.now()
          });
          break;
        }
      }
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
      console.log('User disconnected:', socket.id);
    });
  });
};
