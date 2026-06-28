import React from 'react';

function App() {
  return (
    <div style={{
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      minHeight:'100vh'
    }}>
      <div style={{
        background:'white',
        padding:'40px',
        borderRadius:'15px',
        textAlign:'center',
        maxWidth:'400px',
        width:'90%'
      }}>
        <h1 style={{color:'#333'}}>💬 Chat App</h1>
        <p style={{color:'#666'}}>App is Working!</p>
        <input
          type="email"
          placeholder="Enter email"
          style={{
            width:'100%',
            padding:'12px',
            margin:'10px 0',
            borderRadius:'8px',
            border:'1px solid #ddd',
            fontSize:'14px'
          }}
        />
        <input
          type="password"
          placeholder="Enter password"
          style={{
            width:'100%',
            padding:'12px',
            margin:'10px 0',
            borderRadius:'8px',
            border:'1px solid #ddd',
            fontSize:'14px'
          }}
        />
        <button style={{
          width:'100%',
          padding:'12px',
          background:'#0f3460',
          color:'white',
          border:'none',
          borderRadius:'8px',
          fontSize:'16px',
          cursor:'pointer',
          marginTop:'10px'
        }}>
          Login
        </button>
      </div>
    </div>
  );
}

export default App;
