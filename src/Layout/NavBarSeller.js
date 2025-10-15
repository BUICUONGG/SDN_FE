import React, { useEffect, useState } from "react";
import "./layout.css";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderAdmin from "../Components/Header/HeaderAdmin";
import {
  ShopOutlined,
  ProfileOutlined,
  UserOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  CommentOutlined,
  PhoneOutlined,
  TeamOutlined,
  SettingOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { GoHome } from "react-icons/go";
import HeaderSeller from "../Components/Header/HeaderSeller";

export default function NavbarSeller({ Component }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathKey = location.pathname.split("/")[2]; // ví dụ: /admin/posts => posts

  const [activeKey, setActiveKey] = useState(pathKey || ""); // mặc định là "home"

  // Update khi path thay đổi
  useEffect(() => {
    setActiveKey(pathKey);
  }, [pathKey]);

  const handleClick = (key) => {
    setActiveKey(key);
    navigate(`/seller-page/${key}`); // chuyển hướng route
  };

  return (
    <div className="layoutuser">
      <HeaderSeller />
      <div style={{ background: "#F2ECEC", width: "100%" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            overflow: "hidden",
            height: "100%",
          }}
        >
          <div
            style={{
              width: "15%",
              background: "white",
              marginRight: "1%",
              position: "fixed",
              height: "90vh",
              bottom: "0",
            }}
          >
            <div className="sidebar">
              <div
                className={`sidebar-item ${
                  activeKey === "home" ? "active" : ""
                }`}
                onClick={() => handleClick("home")}
              >
                <span className="sidebar-icon">
                  <GoHome />
                </span>
                <span className="sidebar-label">Trang chủ</span>
              </div>

              {/* op2 */}
              <div style={{
                height: "50%",
              }}>
                <div
                  className={`sidebar-item ${
                    activeKey === "invantion" ? "active" : ""
                  }`}
                  onClick={() => handleClick("invantion")}
                >
                  <span className="sidebar-icon">
                    <ShopOutlined />
                  </span>
                  <span className="sidebar-label">Đơn hàng</span>
                </div>

                <div
                  className={`sidebar-item ${
                    activeKey === "product" ? "active" : ""
                  }`}
                  onClick={() => handleClick("product")}
                >
                  <span className="sidebar-icon">
                    <ProfileOutlined />
                  </span>
                  <span className="sidebar-label">Sản phẩm</span>
                </div>

                <div
                  className={`sidebar-item ${
                    activeKey === "marketing" ? "active" : ""
                  }`}
                  onClick={() => handleClick("marketing")}
                >
                  <span className="sidebar-icon">
                    <UserOutlined />
                  </span>
                  <span className="sidebar-label">Marketing</span>
                </div>
                <div
                  className={`sidebar-item ${
                    activeKey === "message" ? "active" : ""
                  }`}
                  onClick={() => handleClick("message")}
                >
                  <span className="sidebar-icon">
                    <UserOutlined />
                  </span>
                  <span className="sidebar-label">Tin nhắn</span>
                </div>
              </div>


              {/* op5 */}
              <div>
                <div
                  className={`sidebar-item ${
                    activeKey === "members" ? "active" : ""
                  }`}
                  onClick={() => handleClick("members")}
                >
                  <span className="sidebar-icon">
                    <TeamOutlined />
                  </span>
                  <span className="sidebar-label">Thành viên</span>
                </div>

                <div
                  className={`sidebar-item ${
                    activeKey === "setting" ? "active" : ""
                  }`}
                  onClick={() => handleClick("setting")}
                >
                  <span className="sidebar-icon">
                    <SettingOutlined />
                  </span>
                  <span className="sidebar-label">Cài đặt</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ width: "100%", paddingLeft: "15%", paddingTop: "10vh" }}>
            <Component />
          </div>
        </div>
      </div>
    </div>
  );
}
