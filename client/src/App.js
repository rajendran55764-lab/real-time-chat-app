import React from 'react';
import './App.css';

function App() {
  return (
    <div style={{
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      minHeight:'100vh',
      flexDirection:'column'
    }}>
      <div style={{
        background:'white',
        padding:'40px',
        borderRadius:'15px',
        textAlign:'center'
      }}>
        <h1>💬 Real-Time Chat</h1>
        <p>App is working!</p>
      </div>
    </div>
  );
}

export default App;
