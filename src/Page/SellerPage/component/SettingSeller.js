import React, { useState } from "react";
import "./mainSel.css";

export default function SettingSeller() {
  const [activeTab, setActiveTab] = useState("seller"); // 'seller' hoặc 'business'

  return (
    <div className="setting-container">
      <h1 className="title">Hồ sơ người bán</h1>

      <div className="tabs">
        <button>Thông tin tài khoản</button>
        <button
          className={activeTab === "seller" ? "active" : ""}
          onClick={() => setActiveTab("seller")}
        >
          Thông tin người bán
        </button>
        <button
          className={activeTab === "business" ? "active" : ""}
          onClick={() => setActiveTab("business")}
        >
          Thông tin doanh nghiệp
        </button>
      </div>

      {activeTab === "seller" && (
        <div className="card">
          <h2>Thông tin người bán</h2>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{textAlign: "center", width: '10%'}}>
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
                color: "#6EB566"
              }}>🏪</div>
              <select>
                <option>Chỉnh sửa...</option>
              </select>
            </div>

            <div style={{ width: "35%" }}>
              <div>
                <label>Mã cửa hàng</label>
                <p>VNLC8W8WTY</p>
              </div>

              <div>
                <label>Tên cửa hàng</label>
                <p>Xmark đồ cũ</p>
              </div>

              <div>
                <label>Email</label>
                <p>n***1@gmail.com</p>
              </div>
            </div>

            <div style={{ width: "35%" }}>
              <div>
                <label>Loại hình doanh nghiệp</label>
                <p>Doanh nghiệp thuộc sở hữu cá nhân</p>
              </div>

              <div>
                <label>Loại hình người bán</label>
                <p>Người bán địa phương</p>
              </div>

              <div>
                <label>Số điện thoại</label>
                <p>+84****4287</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "business" && (
        <div className="card">
          <h2>Thông tin doanh nghiệp</h2>
          <div className="grid">
            <div>
              <label>Số căn cước công dân</label>
              <p>03********97</p>
            </div>
            <div>
              <label>Tên chủ sở hữu doanh nghiệp</label>
              <p>T**N B* N*</p>
            </div>
            <div>
              <label>Ngày sinh của chủ sở hữu</label>
              <p>24-12-2003</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
