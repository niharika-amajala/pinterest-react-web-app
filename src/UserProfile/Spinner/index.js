import React from 'react';
import { Circles } from 'react-loader-spinner';

function Spinner({ message }) {
  const spinnerContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000, 
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  };

  const spinnerMessageStyle = {
    marginTop: '20px',
    fontSize: '1.5rem',
    textAlign: 'center',
    color: '#00BFFF',
  };

  return (
    <div style={spinnerContainerStyle}>
      <Circles
        color="#00BFFF"
        height={100} 
        width={100}
      />
      <p style={spinnerMessageStyle}>{message}</p>
    </div>
  );
}

export default Spinner;
