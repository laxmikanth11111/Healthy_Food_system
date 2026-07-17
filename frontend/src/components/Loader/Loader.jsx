import React from 'react';

const Loader = ({ size = 'md', text = 'Loading Healthy Bites...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center my-5 animate-fade-in-up">
      <div 
        className={`spinner-border text-success ${size === 'sm' ? 'spinner-border-sm' : ''}`} 
        style={{ 
          width: size === 'lg' ? '3.5rem' : size === 'md' ? '2.5rem' : '1.5rem', 
          height: size === 'lg' ? '3.5rem' : size === 'md' ? '2.5rem' : '1.5rem' 
        }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <p className="mt-3 text-muted" style={{ fontStyle: 'italic', fontWeight: 500 }}>{text}</p>}
    </div>
  );
};

export default Loader;
