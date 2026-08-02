import React from 'react';

export const Placeholder: React.FC = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top left, #1e1e2f, #0a0a13)',
      color: '#fff',
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: '2rem',
    }}
  >
    EventHub Demo – UI is loading correctly!
  </div>
);
