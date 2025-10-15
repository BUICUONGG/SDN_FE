import React, { useEffect } from 'react';
import './SuccessModal.css'

function SuccessModal({ isOpen, onClose, title = "Success!", message = "Your operation was successful.", autoClose = false, closeDelay = 3000 }) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(onClose, closeDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, closeDelay, onClose]);

  if (!isOpen) return null;

  return React.createElement(
    'div',
    { className: 'modal-overlay' },
    React.createElement(
      'div',
      { className: 'modal-content' },
      React.createElement('div', { className: 'success-icon' }),
      React.createElement('h2', { className: 'modal-title' }, title),
      React.createElement('p', { className: 'modal-message' }, message),
      React.createElement(
        'button',
        { className: 'close-button', onClick: onClose },
        'Close'
      )
    )
  );
}

export default SuccessModal;
