import React, { useState, useEffect } from "react";
import UserMenu from "./UserMenu";
import { NavLink } from "react-router-dom";
import "../../css/Header/headerDrop.css";
import SearchFunction from "../SearchServ/SearchFunction";
import CartEven from "../CartEvent/CartEvent";
import { appService } from "../../service/appService";
import LoadingPage from "../Spinner/LoadingPage";
import AdminMenu from "./AdminMenu";

export default function HeaderSeller() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [ld, setld] = useState(false);

  const [mb, setMb] = useState(false);
  const [mp, setMp] = useState(false);
  const [ip, setIp] = useState(false);
  const [dt, setDt] = useState(false);

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
    <div>
      {/* Header chính */}
      <div
        style={{
          background: "#6EB566",
          width: "100%",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease-in-out",
          padding: "0px 1%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: '10vh',
          position: "fixed",
          top: "0",
          zIndex: "1003",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "50%",
          }}
        >
          <a
            style={{
              fontSize: "50px", // Logo nhỏ lại khi cuộn
              color: "white",
              fontWeight: "500",
              transition: "font-size 0.3s ease-in-out",
            }}
            href="/home"
          >
            <span className="font-xmark">xmark</span>
          </a>
          <p
            style={{
              fontSize: "36px",
              color: "white",
              fontWeight: "500",
              margin: "0",
              marginLeft: "10%",
            }}
          >
            Quản Lý Gian Hàng
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "20%",
            justifyContent: "end",
          }}
        >
          <AdminMenu />
        </div>
      </div>
    </div>
  );
}
