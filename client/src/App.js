import React, { useState } from 'react';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import './App.css';

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
    <div style={{minHeight:'100vh'}}>
      <nav>
        <h1>💬 Real-Time Chat</h1>
        <div>
          {token ? (
            <>
              <span style={{color:'white', marginRight:'15px'}}>
                👤 {user?.username}
              </span>
              <button onClick={logout}>
                🚪 Logout
              </button>
            </>
          ) : (
            <span style={{color:'white'}}>
              Please login to chat!
            </span>
          )}
        </div>
      </nav>

      <div className="container">
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
