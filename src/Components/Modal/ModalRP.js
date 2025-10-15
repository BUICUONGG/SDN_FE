import React from "react";

const ModalRP = ({ isOpen, onClose, email, onSendOtp }) => {
  //   const handleForgotPassword = async (email) => {
  //     try {
  //       const response = await appService.forgotPass(email);
  //       console.log("Mã xác minh đã được gửi:", response.data);
  //     } catch (error) {
  //       console.error("Lỗi khi gửi yêu cầu quên mật khẩu:", error);
  //       console.log(email)
  //     }
  //   };

  if (!isOpen) return null;

  return (
    <div
      style={{
        background: "rgba(0, 0, 0, 0.5)",
        width: "100%",
        height: "100%",
        position: "fixed",
        top: "0",
        left: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "5%",
        }}
      >
        <p
          style={{
            fontSize: "24px",
            color: "black",
            fontWeight: "400",
            textAlign: "center",
            marginBottom: "10%",
          }}
        >
          Đặt lại mật khẩu
        </p>
        <p
          style={{
            fontSize: "20px",
            textAlign: "center",
            color: "black",
            fontWeight: "400",
            marginBottom: "20%",
          }}
        >
          Mã xác minh đã được gửi tới địa chỉ email <br />
          <span
            style={{
              color: "#6EB566",
            }}
          >
            {email}
          </span>{" "}
          <br />
          <span>Vui lòng xác minh</span>
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 5%",
          }}
        >
          <button
            onClick={onClose}
            style={{
              borderRadius: "5px",
              fontSize: "20px",
              padding: "0 5%",
              background: "none",
              border: "none",
            }}
          >
            Hủy
          </button>

          <button
            onClick={() => {
              onSendOtp(); // Chuyển sang màn OTP
              onClose(); // Đóng modal Zalo
            }}
            style={{
              borderRadius: "5px",
              fontSize: "20px",
              padding: "0 5%",
              background: "#6EB566",
              color: "white",
              border: "none",
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRP;
