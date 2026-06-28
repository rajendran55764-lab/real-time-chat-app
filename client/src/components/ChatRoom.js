import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import RoomList from './RoomList';

const BACKEND_URL = 'https://real-time-chat-backend-xxxx.onrender.com';

function ChatRoom({ token, user }) {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [error, setError] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(BACKEND_URL);

    socketRef.current.emit('userOnline', user.id);

    socketRef.current.on('newMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('userTyping', (data) => {
      if (data.isTyping) {
        setTyping(`${data.username} is typing...`);
      } else {
        setTyping('');
      }
    });

    socketRef.current.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentRoom) {
      if (socketRef.current) {
        socketRef.current.emit('joinRoom', currentRoom._id);
      }
      fetchMessages(currentRoom._id);
    }
  }, [currentRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (roomId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/messages/${roomId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(data);
      }
    } catch (err) {
      setError('Error loading messages');
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !currentRoom) return;

    socketRef.current.emit('sendMessage', {
      roomId: currentRoom._id,
      content: newMessage,
      senderId: user.id,
      senderName: user.username
    });

    setNewMessage('');
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    socketRef.current.emit('typing', {
      roomId: currentRoom?._id,
      username: user.username,
      isTyping: e.target.value.length > 0
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-layout">
      <RoomList
        token={token}
        currentRoom={currentRoom}
        setCurrentRoom={setCurrentRoom}
      />

      <div className="chat-window">
        {!currentRoom ? (
          <div style={{
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            height:'100%',
            flexDirection:'column',
            gap:'15px',
            color:'#666'
          }}>
            <div style={{fontSize:'60px'}}>💬</div>
            <h3>Select a room to start chatting!</h3>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <h3>💬 {currentRoom.name}</h3>
              <p style={{fontSize:'13px', opacity:0.8}}>
                {currentRoom.description}
              </p>
              <p style={{fontSize:'12px', opacity:0.7, marginTop:'5px'}}>
                🟢 {onlineUsers.length} online
              </p>
            </div>

            <div className="messages-container">
              {messages.length === 0 ? (
                <div style={{textAlign:'center', color:'#999', marginTop:'50px'}}>
                  <p>No messages yet! Start the conversation! 👋</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${msg.senderName === user.username ? 'own' : 'other'}`}
                  >
                    <div className="message-bubble">
                      {msg.content}
                    </div>
                    <div className="message-info">
                      {msg.senderName === user.username ? 'You' : msg.senderName} •{' '}
                      {new Date(msg.createdAt).toLocaleTimeString()
