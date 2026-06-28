import React, { useState } from 'react';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';

function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);

  const logout = () => {
    setToken('');
    setUser(null);
  };

  const handleLogin = (token, userData) => {
    setToken(token);
    setUser(userData);
  };

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    }}>
      <div style={{
        background:'rgba(255,255,255,0.1)',
        backdropFilter:'blur(10px)',
        color:'white',
        padding:'15px 30px',
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
      }}>
        <h1 style={{fontSize:'22px'}}>💬 Real-Time Chat</h1>
        <div>
          {token ? (
            <>
              <span style={{color:'white', marginRight:'15px'}}>
                👤 {user?.username}
              </span>
              <button
                onClick={logout}
                style={{
                  background:'rgba(255,255,255,0.2)',
                  color:'white',
                  border:'1px solid rgba(255,255,255,0.3)',
                  padding:'8px 16px',
                  borderRadius:'25px',
                  cursor:'pointer'
                }}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <span style={{color:'white'}}>Please login to chat!</span>
          )}
        </div>
      </div>

      <div style={{maxWidth:'1200px', margin:'30px auto', padding:'0 20px'}}>
        {!token ? (
          <Login handleLogin={handleLogin} />
        ) : (
          <ChatRoom token={token} user={user} />
        )}
      </div>
    </div>
  );
}

export default App;
