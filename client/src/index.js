import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const BACKEND_URL = 'https://real-time-chat-backend-nqca.onrender.com';

function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

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
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError('Server error, please try again');
    }
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
              color:'red',
              background:'#ffeaea',
              padding:'10px',
              borderRadius:'8px',
              marginBottom:'15px',
              fontSize:'13px'
            }}>{error}</p>
          )}
          {isRegister && (
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width:'100%',
                padding:'12px',
                marginBottom:'10px',
                borderRadius:'8px',
                border:'2px solid #ddd',
                fontSize:'14px',
                boxSizing:'border-box'
              }}
            />
          )}
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width:'100%',
              padding:'12px',
              marginBottom:'10px',
              borderRadius:'8px',
              border:'2px solid #ddd',
              fontSize:'14px',
              boxSizing:'border-box'
            }}
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width:'100%',
              padding:'12px',
              marginBottom:'15px',
              borderRadius:'8px',
              border:'2px solid #ddd',
              fontSize:'14px',
              boxSizing:'border-box'
            }}
          />
          <button
            onClick={handleSubmit}
            style={{
              width:'100%',
              padding:'12px',
              background:'linear-gradient(135deg, #1a1a2e, #0f3460)',
              color:'white',
              border:'none',
              borderRadius:'8px',
              fontSize:'16px',
              cursor:'pointer',
              marginBottom:'15px'
            }}
          >
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
      <div style={{
        background:'rgba(255,255,255,0.1)',
        padding:'15px 30px',
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
      }}>
        <h1 style={{color:'white', fontSize:'20px'}}>💬 Real-Time Chat</h1>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <span style={{color:'white'}}>👤 {user?.username}</span>
          <button
            onClick={() => { setToken(''); setUser(null); }}
            style={{
              background:'rgba(255,255,255,0.2)',
              color:'white',
              border:'none',
              padding:'8px 16px',
              borderRadius:'25px',
              cursor:'pointer'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
      <div style={{
        maxWidth:'800px',
        margin:'30px auto',
        padding:'0 20px',
        color:'white',
        textAlign:'center'
      }}>
        <h2>Welcome {user?.username}! 🎉</h2>
        <p style={{marginTop:'10px', opacity:0.8}}>Chat feature loading...</p>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
