import React from "react";
import { IoStorefront } from "react-icons/io5";
import { NavLink } from "react-router-dom";

export default function SellerPage() {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <IoStorefront
        style={{
          fontSize: "200px",
          color: "#4CAF50",
          marginTop: "5%",
        }}
      />
      <p
        style={{
          fontSize: "20px",
          fontWeight: "500",
          color: "#333",
        }}
      >
        Chào mừng đến với XMARK
      </p>
      <p
        style={{
          fontSize: "20px",
          fontWeight: "500",
          color: "#333",
          padding: "0 35%",
        }}
      >
        Chúng tôi rất vui mừng chào đón bạn trở thành một phần của cộng đồng
        người bán năng động của chúng tôi.
      </p>
      <button
        style={{
          marginTop: "20px",
          marginBottom: "20%",
          border: "none",
          background: "none",
        }}
      >
        <NavLink
          to="/register-seller"
          style={{
            color: "white",
            padding: "10px 30px",
            backgroundColor: "rgb(110, 181, 102)",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Bắt đầu bán ngay
        </NavLink>
      </button>
    </div>
  );
}
