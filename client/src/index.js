import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <div style={{
      background:'white',
      padding:'40px',
      margin:'50px auto',
      maxWidth:'400px',
      borderRadius:'15px',
      textAlign:'center'
    }}>
      <h1>💬 Chat App Working!</h1>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
