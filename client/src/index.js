import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        <h1 style={{color:'#333', marginBottom:'20px'}}>💬 Real-Time Chat</h1>
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
        <button style={{
          width:'100%',
          padding:'12px',
          background:'linear-gradient(135deg, #1a1a2e, #0f3460)',
          color:'white',
          border:'none',
          borderRadius:'8px',
          fontSize:'16px',
          cursor:'pointer'
        }}>
          🚀 Login
        </button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
