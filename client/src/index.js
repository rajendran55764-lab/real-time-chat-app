import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';

const BACKEND_URL = 'https://real-time-chat-backend-nqca.onrender.com';

function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomDesc, setRoomDesc] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (token) {
      fetchRooms();
      socketRef.current = io(BACKEND_URL, {
        transports: ['websocket', 'polling']
      });
      socketRef.current.emit('userOnline', user?.id);
      socketRef.current.on('newMessage', (message) => {
        setMessages(prev => [...prev, message]);
      });
      socketRef.current.on('userTyping', (data) => {
        setTyping(data.isTyping ? `${data.username} is typing...` : '');
      });
      socketRef.current.on('onlineUsers', (users) => {
        setOnlineUsers(users);
      });
      return () => socketRef.current?.disconnect();
    }
  }, [token]);

  useEffect(() => {
    if (currentRoom && socketRef.current) {
      socketRef.current.emit('joinRoom', currentRoom._id);
      fetchMessages(currentRoom._id);
    }
  }, [currentRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/rooms`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setRooms(data);
        if (data.length > 0) setCurrentRoom(data[0]);
      }
    } catch (err) {
      console.log('Error fetching rooms');
    }
  };

  const fetchMessages = async (roomId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/messages/${roomId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setMessages(data);
    } catch (err) {
      console.log('Error fetching messages');
    }
  };

  const handleSubmit = async () => {
    try {
      const url = isRegister
        ? `${BACKEND_URL}/api/auth/register`
        : `${BACKEND_URL}/api/auth/login`;
      const body = isRegister
        ? { username, email, password }
        : { email, password };
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUser(data.user);
        setError('');
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError('Server error, please try again');
    }
  };

  const createRoom = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: roomName, description: roomDesc })
      });
      const data = await res.json();
      if (res.ok) {
        fetchRooms();
        setShowCreateRoom(false);
        setRoomName('');
        setRoomDesc('');
      }
    } catch (err) {
      console.log('Error creating room');
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
    socketRef.current?.emit('typing', {
      roomId: currentRoom?._id,
      username: user.username,
      isTyping: e.target.value.length > 0
    });
  };

  if (!token) {
    return (
      <div style={{
        minHeight:'100vh',
        background:'linear-gradient(135deg, #1a1a2e, #0f3460)',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
      }}>
        <div style={{
          background:'white',
          padding:'40px',
          borderRadius:'15px',
          width:'350px',
          textAlign:'center'
        }}>
          <h1 style={{color:'#333', marginBottom:'5px'}}>💬 Real-Time Chat</h1>
          <p style={{color:'#666', marginBottom:'20px', fontSize:'14px'}}>
            {isRegister ? 'Create an account' : 'Login to continue'}
          </p>
          {error && (
            <p style={{
              color:'red', background:'#ffeaea',
              padding:'10px', borderRadius:'8px',
              marginBottom:'15px', fontSize:'13px'
            }}>{error}</p>
          )}
          {isRegister && (
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{width:'100%', padding:'12px', marginBottom:'10px',
                borderRadius:'8px', border:'2px solid #ddd',
                fontSize:'14px', boxSizing:'border-box'}}
            />
          )}
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{width:'100%', padding:'12px', marginBottom:'10px',
              borderRadius:'8px', border:'2px solid #ddd',
              fontSize:'14px', boxSizing:'border-box'}}
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{width:'100%', padding:'12px', marginBottom:'15px',
              borderRadius:'8px', border:'2px solid #ddd',
              fontSize:'14px', boxSizing:'border-box'}}
          />
          <button onClick={handleSubmit} style={{
            width:'100%', padding:'12px',
            background:'linear-gradient(135deg, #1a1a2e, #0f3460)',
            color:'white', border:'none', borderRadius:'8px',
            fontSize:'16px', cursor:'pointer', marginBottom:'15px'
          }}>
            {isRegister ? '🎉 Register' : '🚀 Login'}
          </button>
          <p
            style={{color:'#0f3460', cursor:'pointer', fontSize:'14px'}}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Already have account? Login' : "Don't have account? Register"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh', background:'linear-gradient(135deg, #1a1a2e, #0f3460)'}}>
      {/* Navbar */}
      <div style={{
        background:'rgba(255,255,255,0.1)',
        padding:'15px 30px',
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
      }}>
        <h1 style={{color:'white', fontSize:'20px'}}>💬 Real-Time Chat</h1>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <span style={{color:'white'}}>🟢 {onlineUsers.length} online</span>
          <span style={{color:'white'}}>👤 {user?.username}</span>
          <button
            onClick={() => { setToken(''); setUser(null); }}
            style={{
              background:'rgba(255,255,255,0.2)',
              color:'white', border:'none',
              padding:'8px 16px', borderRadius:'25px', cursor:'pointer'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Chat Layout */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'280px 1fr',
        gap:'20px',
        maxWidth:'1200px',
        margin:'20px auto',
        padding:'0 20px',
        height:'calc(100vh - 100px)'
      }}>
        {/* Room List */}
        <div style={{
          background:'rgba(255,255,255,0.95)',
          borderRadius:'15px',
          overflow:'hidden',
          display:'flex',
          flexDirection:'column'
        }}>
          <div style={{
            padding:'15px',
            background:'linear-gradient(135deg, #1a1a2e, #0f3460)',
            color:'white'
          }}>
            <h3 style={{marginBottom:'10px'}}>💬 Chat Rooms</h3>
            <button
              onClick={() => setShowCreateRoom(!showCreateRoom)}
              style={{
                width:'100%', padding:'8px',
                background:'rgba(255,255,255,0.2)',
                color:'white', border:'none',
                borderRadius:'8px', cursor:'pointer', fontSize:'13px'
              }}
            >
              ➕ New Room
            </button>
          </div>

          {showCreateRoom && (
            <div style={{padding:'15px', background:'#f8f9fa', borderBottom:'1px solid #eee'}}>
              <input
                type="text"
                placeholder="Room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                style={{width:'100%', padding:'8px', marginBottom:'8px',
                  borderRadius:'8px', border:'1px solid #ddd',
                  fontSize:'13px', boxSizing:'border-box'}}
              />
              <input
                type="text"
                placeholder="Description"
                value={roomDesc}
                onChange={(e) => setRoomDesc(e.target.value)}
                style={{width:'100%', padding:'8px', marginBottom:'8px',
                  borderRadius:'8px', border:'1px solid #ddd',
                  fontSize:'13px', boxSizing:'border-box'}}
              />
              <button onClick={createRoom} style={{
                width:'100%', padding:'8px',
                background:'linear-gradient(135deg, #1a1a2e, #0f3460)',
                color:'white', border:'none',
                borderRadius:'8px', cursor:'pointer', fontSize:'13px'
              }}>
                Create Room
              </button>
            </div>
          )}

          <div style={{overflowY:'auto', flex:1}}>
            {rooms.length === 0 ? (
              <p style={{padding:'20px', color:'#666', fontSize:'13px', textAlign:'center'}}>
                No rooms yet! Create one!
              </p>
            ) : (
              rooms.map(room => (
                <div
                  key={room._id}
                  onClick={() => setCurrentRoom(room)}
                  style={{
                    padding:'15px',
                    cursor:'pointer',
                    borderBottom:'1px solid #eee',
                    background: currentRoom?._id === room._id ? '#e8f4fd' : 'white',
                    borderLeft: currentRoom?._id === room._id ? '3px solid #0f3460' : '3px solid transparent',
                    display:'flex',
                    alignItems:'center',
                    gap:'10px'
                  }}
                >
                  <div style={{
                    width:'40px', height:'40px',
                    borderRadius:'50%',
                    background:'linear-gradient(135deg, #1a1a2e, #0f3460)',
                    display:'flex', alignItems:'center',
                    justifyContent:'center',
                    color:'white', fontSize:'16px', flexShrink:0
                  }}>💬</div>
                  <div>
                    <p style={{fontWeight:'600', fontSize:'14px', color:'#333'}}>{room.name}</p>
                    <p style={{fontSize:'12px', color:'#666'}}>{room.description || 'No description'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div style={{
          background:'rgba(255,255,255,0.95)',
          borderRadius:'15px',
          display:'flex',
          flexDirection:'column',
          overflow:'hidden'
        }}>
          {!currentRoom ? (
            <div style={{
              display:'flex', alignItems:'center',
              justifyContent:'center', height:'100%',
              flexDirection:'column', gap:'15px', color:'#666'
            }}>
              <div style={{fontSize:'60px'}}>💬</div>
              <h3>Select a room to start chatting!</h3>
            </div>
          ) : (
            <>
              <div style={{
                padding:'20px',
                background:'linear-gradient(135deg, #1a1a2e, #0f3460)',
                color:'white'
              }}>
                <h3>💬 {currentRoom.name}</h3>
                <p style={{fontSize:'13px', opacity:0.8}}>{currentRoom.description}</p>
              </div>

              <div style={{
                flex:1, overflowY:'auto',
                padding:'20px',
                display:'flex', flexDirection:'column', gap:'10px'
              }}>
                {messages.length === 0 ? (
                  <p style={{textAlign:'center', color:'#999', marginTop:'50px'}}>
                    No messages yet! Start the conversation! 👋
                  </p>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        display:'flex',
                        flexDirection:'column',
                        alignItems: msg.senderName === user.username ? 'flex-end' : 'flex-start',
                        maxWidth:'70%',
                        alignSelf: msg.senderName === user.username ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div style={{
                        padding:'10px 15px',
                        borderRadius:'15px',
                        background: msg.senderName === user.username
                          ? 'linear-gradient(135deg, #1a1a2e, #0f3460)'
                          : '#f0f0f0',
                        color: msg.senderName === user.username ? 'white' : '#333',
                        fontSize:'14px'
                      }}>
                        {msg.content}
                      </div>
                      <p style={{fontSize:'11px', color:'#999', marginTop:'4px', padding:'0 5px'}}>
                        {msg.senderName === user.username ? 'You' : msg.senderName} •{' '}
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
                {typing && (
                  <p style={{fontSize:'12px', color:'#999', fontStyle:'italic'}}>{typing}</p>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div style={{
                padding:'15px 20px',
                borderTop:'1px solid #eee',
                display:'flex', gap:'10px', alignItems:'center'
              }}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={handleTyping}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  style={{
                    flex:1, padding:'12px 15px',
                    border:'2px solid #e0e0e0',
                    borderRadius:'25px', fontSize:'14px', outline:'none'
                  }}
                />
                <button
                  onClick={sendMessage}
                  style={{
                    padding:'12px 20px',
                    background:'linear-gradient(135deg, #1a1a2e, #0f3460)',
                    color:'white', border:'none',
                    borderRadius:'25px', cursor:'pointer', fontSize:'14px'
                  }}
                >
                  Send 🚀
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
