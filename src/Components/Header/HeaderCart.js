import React, { useState, useEffect } from "react";
import UserMenu from "./UserMenu";
import { NavLink, useNavigate } from "react-router-dom";
import "../../css/Header/headerDrop.css";
import SearchFunction from "../SearchServ/SearchFunction";
import { appService } from "../../service/appService";
import LoadingPage from "../Spinner/LoadingPage";
import { notification } from "antd";
import { FaRegBell } from "react-icons/fa";

export default function HeaderCart() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [ld, setld] = useState(false);
  const navigate = useNavigate();

  const [mb, setMb] = useState(false);
  const [mp, setMp] = useState(false);
  const [ip, setIp] = useState(false);
  const [dt, setDt] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  useEffect(() => {
    const updateSlidesToShow = () => {
      const width = window.innerWidth;

      if (width < 480) {
        setIp(false);
        setMp(false);
        setMb(true);
        setDt(false);
      } else if (width < 768) {
        setIp(false);
        setMp(true);
        setMb(false);
        setDt(false);
      } else if (width < 1024) {
        setIp(true);
        setMp(false);
        setMb(false);
        setDt(false);
      } else {
        setIp(false);
        setMp(false);
        setMb(false);
        setDt(true);
      }
    };

    updateSlidesToShow(); // Cập nhật lần đầu

    window.addEventListener("resize", updateSlidesToShow); // Lắng nghe resize

    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await appService.getProfile();
        setld(false);
      } catch (error) {
        setld(false);
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleCheckStore = async () => {
    try {
      const res = await appService.getDetailStoreUser();
      if (res.data) {
        navigate("/seller-page");
      } else {
        navigate("/seller");
      }
    } catch (error) {
      setld(false);
      console.error("Lỗi khi lấy dữ liệu cửa hàng:", error);
      setTimeout(() => {
        openNotification(
          "warning",
          "Cảnh báo",
          "Tài khoản chưa đăng ký shop vui lòng đăng ký shop trước!"
        );
      }, 100);
      setTimeout(() => {
        navigate("/seller");
      }, 1000);
      
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1001,
        width: "100%",
      }}
    >
      {contextHolder}
      {ld && <LoadingPage />}
      {/* Thanh trên cùng */}
      <div
        style={{
          width: "100%",
          background: "#6EB566",
          display: "flex",
          justifyContent: "space-evenly",
          fontSize: "14px",
          color: "white",
          padding: "7px 5%",
        }}
      >
        <span onClick={handleCheckStore} style={{ cursor: "pointer" }}>
          {" "}
          Kênh người bán
        </span>
        <span style={{ cursor: "pointer" }}> Đóng góp ý kiến</span>
        <span style={{ cursor: "pointer" }}> Hỗ trợ</span>
        <span style={{ cursor: "pointer" }}> Thay đổi ngôn ngữ</span>
      </div>

      {/* Header chính */}
      <div
        style={{
          background: "white",
          position: "fixed",
          top: "30px",
          left: 0,
          width: "100%",
          zIndex: 1000,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease-in-out",
          padding: "0px 10%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <a
            style={{
              fontSize: "50px", // Logo nhỏ lại khi cuộn
              width: "30%",
              color: "#6EB566",
              fontWeight: "500",
              transition: "font-size 0.3s ease-in-out",
            }}
            href="/home"
          >
            <span className="font-xmark">xmark</span>
            <span style={{
              fontSize: "30px",
              marginLeft: "10%",
            }} className="font-xmark">Giỏ Hàng</span>
          </a>

          <SearchFunction />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "25%",
              justifyContent: "end",
              gap: "10%",
              color: "#6EB566",
            }}
          >
            <FaRegBell 
              style={{
                fontSize: "25px",
                color: "#6EB566",
                cursor: "pointer",
              }}
            />
            <UserMenu />
          </div>
        </div>
      </div>
      {/* Khoảng trống để tránh bị che mất nội dung */}
      <div style={{ marginTop: "10px" }}></div>
    </div>
  );
}
