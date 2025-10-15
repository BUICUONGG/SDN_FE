import React, { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaFacebook,
  FaGoogle,
  FaTimes,
} from "react-icons/fa";
import { localUserService } from "../../service/localService";
import { userService } from "../../service/userService";
import { validateEmail } from "../../Validation/CheckEmail/CheckMail";
import { validatePass } from "../../Validation/checkPass/CheckPass";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "./wait.json";
import animaSuccess from "./succes.json";
import animaFail from "./fail.json";
import { notification } from "antd";

export default function UserLogin({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuc, setIsSuc] = useState(false);
  const [isFail, setIsFail] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  const handleLogin = async () => {
    const emailValidation = validateEmail(email);
    const passValidation = validatePass(pass);
    if (!email || !pass) {
        openNotification(
            "error",
            "Thất bại",
            "Vui lòng nhập đầy đủ tài khoản và mật khẩu"
          );
      return;
    }
    if (!emailValidation.isValid) {
        openNotification(
            "error",
            "Thất bại",
            "Email không đúng định dạng"
          );
      return;
    } else if (!passValidation.isValid) {
        openNotification(
            "error",
            "Thất bại",
            "mật khẩu ít nhất 8 ký tự và chứa kí tự đc biệt và chữ cái in hoa"
          );
      return;
    } else {
        setIsLoading(true);
      try {
        const loginData = {
          email: email,
          password: pass,
        };
        const res = await userService.postLogin(loginData);
        console.log("API response:", res.data);
        
        if (res.data.status === true && res.data.metadata) {
          localUserService.set(res.data);
          console.log(res);
          localStorage.setItem("token", "your_jwt_token");
          setTimeout(() => {
            setIsLoading(false)
            setIsSuc(true)
          }, 1500);
          setTimeout(() => {
            if (onLogin) {
              // Kiểm tra onLogin có tồn tại không trước khi gọi
              onLogin();
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            }
          }, 3000);
        }
      } catch (err) {
        console.error("Lỗi đăng nhập:", err.response.data.metadata.message);
        setTimeout(() => {
            setIsLoading(false)
            setIsFail(true)
            openNotification(
                "error",
                "Thất bại",
                err.response.data.metadata.message
              );
          }, 1500);
        setTimeout(() => {
            setIsFail(false)
            
          }, 3000);
      }
    }
  };

  return (
    <div
      style={{
        height: "100%",
      }}
    >
    {contextHolder}
      {isLoading && (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Player
            autoplay
            loop
            src={animationData}
            style={{ height: "200px", width: "200px" }}
          />
        </div>
      )}
      {/* thanh cong */}
      {isSuc && (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Player
            autoplay
            loop
            src={animaSuccess}
            style={{ height: "200px", width: "200px" }}
          />
        </div>
      )}
      {/* that bai */}
      {isFail && (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Player
            autoplay
            loop
            src={animaFail}
            style={{ height: "200px", width: "200px" }}
          />
        </div>
      )}
      {!isLoading && !isFail&& !isSuc&&(
        <div
          style={{
            padding: "5%",
          }}
        >
          <h2>ĐĂNG NHẬP</h2>
          <div className="modal-body">
            <label>Tên đăng nhập</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              placeholder="Email người dùng"
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

            <a style={{ cursor: "pointer" }} className="forgot-password">
              Quên mật khẩu?
            </a>

            <button onClick={handleLogin} className="login-button">
              ĐĂNG NHẬP
            </button>
            <a
              // onClick={() => setIsSms(true)}
              style={{ cursor: "pointer" }}
              className="sms-login"
            >
              Đăng nhập bằng SMS
            </a>

            <span
              style={{
                cursor: "default",
              }}
            >
              Hoặc
            </span>

            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <button className="social-login google">
                <FaGoogle style={{ marginRight: "2%" }} /> Google
              </button>
              <button className="social-login facebook">
                <FaFacebook style={{ marginRight: "2%" }} /> Facebook
              </button>
            </div>
            <p style={{ textAlign: "left", marginTop: "5%", fontSize: "16px" }}>
              Bạn mới biết đến xmark lần đầu?{" "}
              <span
                //   onClick={() => setIsDK(true)}
                style={{
                  color: "#1A81FF",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Đăng ký
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
