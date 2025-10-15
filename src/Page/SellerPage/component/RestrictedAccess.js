import React from 'react'
import { TbLockExclamation } from "react-icons/tb";
import { ImNotification } from "react-icons/im";

export default function RestrictedAccess() {
  return (
    <div
      style={{
        minHeight: "100vh", // hoặc height: '100%' nếu cha đủ cao
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "#555",
        position: "absolute",
        backgroundColor: "white",
        width: "100%",
        top: 0,
        left: 0,
      }}
    >
      <div
        style={{
          width: "80%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          marginBottom: "10%",
          height: "5vh",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            width: "5px",
            height: "100%",
            backgroundColor: "#6EB566",
            marginRight: "10px",
          }}
        ></span>
        <ImNotification
          style={{
            color: "#6EB566",
          }}
        />
        <span
          style={{
            fontSize: "14px",
            color: "#000",
            marginLeft: "10px",
          }}
        >
          Đơn đăng ký của bạn hiện đang trong quá trình xét duyệt. Sản phẩm của
          bạn sẽ hiển thị với khách hàng sau khi hoàn tất xác minh. Cảm ơn bạn
          đã kiên nhẫn chờ đợi!
        </span>
      </div>
      <TbLockExclamation style={{
        fontSize: "100px",
        marginBottom: "20px",
      }}/>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>
        Quyền truy cập bị hạn chế
      </h2>
      <p style={{ maxWidth: "400px", fontSize: "14px" }}>
        Bạn không thể thực hiện hành động này do tài khoản của bạn chưa được cấp quyền trên trang. Vui lòng liên hệ với quản trị viên hoặc chủ sở hữu tài khoản để được cấp quyền. Xin cảm ơn!
      </p>
    </div>
  );
}


