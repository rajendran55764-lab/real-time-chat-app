import React, { useState, useEffect } from 'react';

function RoomList({ token, currentRoom, setCurrentRoom }) {
  const [rooms, setRooms] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch('https://real-time-chat-backend-nqca.onrender.com/api/rooms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setRooms(data);
        if (data.length > 0 && !currentRoom) {
          setCurrentRoom(data[0]);
        }
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const createRoom = async () => {
    try {
      const res = await fetch('https://real-time-chat-backend-nqca.onrender.com/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newRoom)
      });
      const data = await res.json();
      if (res.ok) {
        fetchRooms();
        setShowCreate(false);
        setNewRoom({ name: '', description: '' });
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="room-list">
      <div className="room-list-header">
        <h3>💬 Chat Rooms</h3>
        <button
          className="btn btn-success"
          style={{padding:'6px 12px', fontSize:'12px', width:'100%'}}
          onClick={() => setShowCreate(!showCreate)}
        >
          ➕ New Room
        </button>
      </div>

      {showCreate && (
        <div style={{padding:'15px', background:'#f8f9fa', borderBottom:'1px solid #eee'}}>
          {error && <p className="error" style={{fontSize:'12px'}}>{error}</p>}
          <input
            type="text"
            placeholder="Room name"
            value={newRoom.name}
            onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
            style={{
              width:'100%',
              padding:'8px',
              marginBottom:'8px',
              borderRadius:'8px',
              border:'1px solid #ddd',
              fontSize:'13px'
            }}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newRoom.description}
            onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
            style={{
              width:'100%',
              padding:'8px',
              marginBottom:'8px',
              borderRadius:'8px',
              border:'1px solid #ddd',
              fontSize:'13px'
            }}
          />
          <button
            className="btn"
            style={{padding:'8px 15px', fontSize:'13px', width:'100%'}}
            onClick={createRoom}
          >
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
              className={`room-item ${currentRoom?._id === room._id ? 'active' : ''}`}
              onClick={() => setCurrentRoom(room)}
            >
              <div style={{
                width:'40px',
                height:'40px',
                borderRadius:'50%',
                background:'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                color:'white',
                fontSize:'16px',
                flexShrink:0
              }}>
                💬
              </div>
              <div>
                <p style={{fontWeight:'600', fontSize:'14px', color:'#333'}}>
                  {room.name}
                </p>
                <p style={{fontSize:'12px', color:'#666'}}>
                  {room.description || 'No description'}
