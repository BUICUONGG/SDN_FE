import React, { useEffect, useState } from "react";
import "./layout.css";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
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
import { localUserService } from "../service/localService";

export default function NavBarAdmin({ Component }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathKey = location.pathname.split("/")[2]; // ví dụ: /admin/posts => posts

  const [activeKey, setActiveKey] = useState(pathKey || "dashboard");
  

  // Update khi path thay đổi
  useEffect(() => {
    setActiveKey(pathKey);
  }, [pathKey]);

  const handleClick = (key) => {
    setActiveKey(key);
    navigate(`/admin-page/${key}`); // chuyển hướng route
  };

  const userInfo = localUserService.get();
  if (!userInfo) {
    return <Navigate to="/admin-login" />;
  }

  return (
    <div className="layoutuser">
      <HeaderAdmin />
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
                  activeKey === "dashboard" ? "active" : ""
                }`}
                onClick={() => handleClick("dashboard")}
              >
                <span className="sidebar-icon">
                  <DashboardOutlined />
                </span>
                <span className="sidebar-label">Dashboard</span>
              </div>

              {/* op2 */}
              <div>
                <div
                  className={`sidebar-item ${
                    activeKey === "store" ? "active" : ""
                  }`}
                  onClick={() => handleClick("store")}
                >
                  <span className="sidebar-icon">
                    <ShopOutlined />
                  </span>
                  <span className="sidebar-label">Quản lý cửa hàng</span>
                </div>

                <div
                  className={`sidebar-item ${
                    activeKey === "posts" ? "active" : ""
                  }`}
                  onClick={() => handleClick("posts")}
                >
                  <span className="sidebar-icon">
                    <ProfileOutlined />
                  </span>
                  <span className="sidebar-label">Quản lý bài đăng</span>
                </div>

                <div
                  className={`sidebar-item ${
                    activeKey === "customers" ? "active" : ""
                  }`}
                  onClick={() => handleClick("customers")}
                >
                  <span className="sidebar-icon">
                    <UserOutlined />
                  </span>
                  <span className="sidebar-label">Quản lý khách hàng</span>
                </div>
              </div>

              {/* op3 */}
              <div>
                <div
                  className={`sidebar-item ${
                    activeKey === "payments" ? "active" : ""
                  }`}
                  onClick={() => handleClick("payments")}
                >
                  <span className="sidebar-icon">
                    <CreditCardOutlined />
                  </span>
                  <span className="sidebar-label">Quản lý thanh toán</span>
                </div>

                <div
                  className={`sidebar-item ${
                    activeKey === "orders" ? "active" : ""
                  }`}
                  onClick={() => handleClick("orders")}
                >
                  <span className="sidebar-icon">
                    <FileTextOutlined />
                  </span>
                  <span className="sidebar-label">Quản lý đơn hàng</span>
                </div>
              </div>

              {/* op4 */}

              <div>
                <div
                  className={`sidebar-item ${
                    activeKey === "reviews" ? "active" : ""
                  }`}
                  onClick={() => handleClick("reviews")}
                >
                  <span className="sidebar-icon">
                    <CommentOutlined />
                  </span>
                  <span className="sidebar-label">Quản lý đánh giá</span>
                </div>

                <div
                  className={`sidebar-item ${
                    activeKey === "support" ? "active" : ""
                  }`}
                  onClick={() => handleClick("support")}
                >
                  <span className="sidebar-icon">
                    <PhoneOutlined />
                  </span>
                  <span className="sidebar-label">Hỗ trợ & khiếu nại</span>
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
                    activeKey === "settings" ? "active" : ""
                  }`}
                  onClick={() => handleClick("settings")}
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
