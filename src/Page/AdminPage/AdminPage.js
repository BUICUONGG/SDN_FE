import React, { useState } from "react";
import "../AdminPage/admin.css";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { validateEmail } from "../../Validation/CheckEmail/CheckMail";
import { validatePass } from "../../Validation/checkPass/CheckPass";
import { notification } from "antd";
import { localUserService } from "../../service/localService";
import { setLoginAction } from "../../redux/action/userAction";
import { useDispatch } from "react-redux";
import { userService } from "../../service/userService";
import { Navigate, useNavigate } from "react-router-dom";
import { u } from "framer-motion/client";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pass, setPass] = useState("");
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const openNotification = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };
  const userInfo = localUserService.get();
  if (userInfo) {
    return <Navigate to="/admin-page/dashboard" />;
  }
  const handleLogin = async () => {
    const emailValidation = validateEmail(email);
    const passValidation = validatePass(pass);
    if (!email || !pass) {
      openNotification("error", "Lỗi", "vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (!emailValidation.isValid) {
      openNotification("error", "Lỗi", "email không đúng định dạng");
    } else if (!passValidation.isValid) {
      openNotification(
        "error",
        "Lỗi",
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt"
      );
    } else {
      try {
        const loginData = {
          email: email,
          password: pass,
        };
        setLoading(true);
        console.log(loginData)
        const res = await userService.postLogin(loginData);
        console.log("Kết quả đăng nhập:", res);
        if (res.data.status === true && res.data.metadata) {
          localUserService.set(res.data);
          localStorage.setItem("token", "your_jwt_token");
          setTimeout(() => {
            openNotification("success", "Thành công", "Đăng nhập thành công!");
          }, 1000);
          setTimeout(() => {
            dispatch(setLoginAction(res.data));
            setLoading(false);
            navigate("/admin-page/dashboard");
          }, 1500);
        }
      } catch (err) {
        console.error("Lỗi đăng nhập:", err);
        setTimeout(() => {
          openNotification("error", "Lỗi", err.response?.data?.metadata.message);
          setLoading(false);
        }, 1500);
      }
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div className="modal-container">
        <h2 style={{
          fontSize: "48px",
        }} className="modal-title">ĐĂNG NHẬP</h2>
        <p
          style={{
            color: "black",
            fontSize: "16px",
            fontWeight: "400",
            margin: "0",
          }}
        >
          Đăng nhập quản lý Website
        </p>
        <div className="modal-body">
          <label>Tai khoản</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="text"
            placeholder="Tên đăng nhập"
          />

          <label>Mật khẩu</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            style={{
              color: "#1A81FF",
              background: "none",
              border: "none",
              padding: "0",
              cursor: "pointer",
              marginTop: "10px",
              outline: "none",
            }}
            className="forgot-password"
          >
            Quên mật khẩu?
          </button>

          <button
            style={{
              marginTop: "10%",
              marginBottom: "30%",
              padding: "10px 0",
            }}
            onClick={handleLogin}
            className="login-button"
          >
            ĐĂNG NHẬP
          </button>
        </div>
      </div>
    </div>
  );
}
