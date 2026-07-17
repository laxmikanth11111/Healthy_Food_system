import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className="toast show align-items-center text-white border-0 position-fixed top-0 end-0 m-3 p-2 shadow-lg animate-fade-in-up" 
      style={{
        zIndex: 9999,
        background: type === 'success' ? 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)' :
                    type === 'error' ? 'linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)' :
                    'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
        borderRadius: '12px'
      }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="d-flex">
        <div className="toast-body d-flex align-items-center">
          <i className={`bi ${type === 'success' ? 'bi-check-circle-fill' : type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'} me-2 fs-5`}></i>
          <span style={{ fontWeight: 500 }}>{message}</span>
        </div>
        <button 
          type="button" 
          className="btn-close btn-close-white me-2 m-auto" 
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
};

export default Toast;
