import { Button, Dropdown, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { localUserService } from "../../service/localService";
import { appService } from "../../service/appService";
import LoadingPage from "../Spinner/LoadingPage";

const UserDrop = ({ user, logoutBtn }) => {
  const [data, setData] = useState("");
  const navigate = useNavigate();
  const userName = user.email;
  const status = user.status;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await appService.getProfile();
        setData(res.data.metadata);
        console.log("Dữ liệu người dùng:", res.data.metadata);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    };

    fetchProfile();
  }, []);

  let handleLogout = () => {
    localUserService.remove();
    localStorage.removeItem("token", "your_jwt_token");
    window.location.reload();
  };

  const userMenuItems = [
    {
      key: "0",
      label: (
        <div
          style={{
            textAlign: "center",
            padding: "10px 100px",
            fontSize: "14px",
          }}
        >
          {userName}
        </div>
      ),
      disabled: false,
    },
    { key: "divider1", type: "divider" }, // Đường kẻ ngang

    {
      key: "1",
      label: (
        <div style={{ fontSize: "20px", background: "#ECECEC", padding: "0" }}>
          Quản lý đơn hàng
        </div>
      ),
      disabled: true,
    },
    {
      key: "2",
      label: (
        <a href="/settings/buylist">
          <FileTextOutlined /> Đơn mua
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a href="/sales">
          <FileTextOutlined /> Đơn bán
        </a>
      ),
    },
    { key: "divider2", type: "divider" },

    {
      key: "4",
      label: (
        <div style={{ fontSize: "20px", background: "#ECECEC" }}>
          Ưu đãi, khuyến mãi
        </div>
      ),
      disabled: true,
    },
    {
      key: "5",
      label: <a href="/offers">Ưu đãi của tôi</a>,
    },
    { key: "divider3", type: "divider" },

    {
      key: "6",
      label: (
        <div style={{ fontSize: "20px", background: "#ECECEC" }}>Khác</div>
      ),
      disabled: true,
    },
    {
      key: "7",
      label: (
        <a href="/settings">
          <SettingOutlined /> Cài đặt tài khoản
        </a>
      ),
    },
    {
      key: "8",
      label: (
        <a href="/help">
          <QuestionCircleOutlined /> Trợ giúp
        </a>
      ),
    },
    {
      key: "9",
      label: (
        <span onClick={handleLogout}>
          <LogoutOutlined /> Đăng Xuất
        </span>
      ),
    },
  ];

  const menuStyle = {
    background: "white",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    borderRadius: "4px",
    padding: "8px",
    position: "relative",
    zIndex: 1000,
  };

  const itemStyle = {
    padding: "0px",
    cursor: "pointer",
    width: "100%",
    textAlign: "center",
  };

  const itemHoverStyle = {
    backgroundColor: "#ccc",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {/* User Dropdown */}
      <div>
        <Dropdown
          menu={{ items: status ? userMenuItems : userMenuItems }}
          placement="bottom"
          arrow
        >
          <div>
            <img
              src={
                data?.avatar ||
                "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
              }
              alt="User Avatar"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                cursor: "pointer",
                objectFit: "cover",
                border: "2px solid white",
              }}
            />
            <span style={{
              fontSize: "16px",
              marginLeft: "8px",
              cursor: "pointer",
              textTransform: "capitalize",
            }}>
              {`${data?.firstName ?? ''} ${data?.lastName ?? ''}`.slice(0, 10)}
            </span>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default UserDrop;
