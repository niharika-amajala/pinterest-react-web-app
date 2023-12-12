import React from 'react';
import './BlurredLoginPrompt.css';

const BlurredLoginPrompt = ({ message }) => {
  return (
    <div className="blurred-login-overlay">
      <div className="login-message">
        <h1>Please log in to see and explore {message}</h1>
      </div>
    </div>
  );
};

export default BlurredLoginPrompt;