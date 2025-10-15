import React, { useEffect } from "react";
import "./EnrollModal.css";

export default function EnrollModal({ message, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="error-modal">
      <p>{message}</p>
    </div>
  );
}
