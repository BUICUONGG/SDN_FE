import React from "react";

const ZaloModal = ({ isOpen, onClose, phoneNumber, onSendOtp }) => {
  if (!isOpen) return null;

  return (
    <div 
        style={{
            background: 'rgba(0, 0, 0, 0.5)',
            width: '100%',
            height: '100%',
            position: 'fixed',
            top: '0',
            left: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
    >
      <div
        style={{
            background: 'white',
            padding: '2%',
        }}
      >
        <p style={{fontSize: '24px', textAlign:'start'}}>
          Bạn sẽ nhận được mã xác minh Zalo được gửi tới <br /> 
          <span> (+84) {phoneNumber}</span>
        </p>
        <div
            style={{
                display : 'flex',
                justifyContent: 'space-between',
                padding: '0 5%'
            }}
        >
            <button
                onClick={onClose}
                style={{
                    borderRadius: '5px',
                    fontSize: '20px',
                    padding: '0 5%',
                    background: 'none'
                }}
            >Hủy</button>
            
            <button 
                onClick={() => {
                    onSendOtp();  // Chuyển sang màn OTP
                    onClose();    // Đóng modal Zalo
                }}
                style={{
                    borderRadius: '5px',
                    fontSize: '20px',
                    padding: '0 5%',
                    background: '#6EB566',
                    color: 'white',
                    border: 'none'
                }}
            >
                Gửi qua Zalo
            </button>
        </div>
      </div>
    </div>
  );
};

export default ZaloModal;
