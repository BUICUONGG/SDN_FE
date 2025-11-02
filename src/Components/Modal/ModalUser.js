import React, { useEffect, useRef, useState } from "react";
import {
  FaGoogle,
  FaFacebook,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "./ModalUser.css";
import ZaloModal from "./ZaloModal";
import { validatePhone } from "../../Validation/CheckPhone/CheckPhone";
import { userService } from "../../service/userService";
import { message } from "antd";
import { localUserService } from "../../service/localService";
import { useDispatch } from "react-redux";
import { setLoginAction, setSignUpAction } from "../../redux/action/userAction";
import ModalRP from "./ModalRP";
import { validateEmail } from "../../Validation/CheckEmail/CheckMail";
import { appService } from "../../service/appService";
import { Button, notification, Space } from "antd";
import { validatePass } from "../../Validation/checkPass/CheckPass";
import { Alert, Flex, Spin } from "antd";
import { IoIosArrowRoundBack } from "react-icons/io";
import rt from "../../img/logo/free_return.png";
import sb from "../../img/logo/Save_buy.png";
import gg from "../../img/Google-removebg-preview.png";

export default function ModalUser({ isOpen, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isSms, setIsSms] = useState(false);
  const [isOtp, setIsOtp] = useState(false);
  const [countDown, setCountDown] = useState(12);
  const [canResend, setCanResend] = useState(false);
  const otpLength = 6;
  const [otp, setOtp] = useState(Array(otpLength).fill(""));
  const inputRefs = useRef([]);
  const [zaloModal, setZaloModal] = useState(false);
  const [repass, setRepass] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [pass, setPass] = useState("");
  const [isRP, setIsRP] = useState(false);
  const [isDK, setIsDK] = useState(false);
  const dispatch = useDispatch();
  const [isNewPass, setIsNewPass] = useState(false);
  const [isXT, setIsXT] = useState(false);
  const [loading, setLoading] = useState(false);
  const [np, setNp] = useState("");
  const [np2, setNp2] = useState("");

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (!/^[0-9]$/.test(value) && value !== "") return; // Chỉ nhận số

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus vào ô tiếp theo nếu có nhập giá trị
    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  // Xử lý phím Backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const saveOtp = otp.join("");

  const handleResendCode = async () => {
    const data = {
      email: email,
      otpType: "REGISTER",
    };
    try {
      await appService.resendOtp(data);
      openNotification("success", "Thành công", "Yêu cầu đã được gửi!");
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu:", err);
      openNotification(
        "error",
        "Lỗi",
        err?.response?.data?.metadata?.message || "Gửi yêu cầu thất bại"
      );
    }
    setCanResend(false);
    setCountDown(12);
  };

  const handleOnclose = () => {
    setShowPassword(false);
    setIsSms(false);
    setIsOtp(false);
    setCountDown(12);
    setCanResend(false);
    setIsRP(false);
    setIsDK(false);
    setIsXT(false);
    setOtp(Array(otpLength).fill("")); // Reset OTP input
    onClose(); // Gọi hàm đóng modal từ props
    setPhoneNumber("");
  };

  const handleOtp = () => {
    const phoneValidation = validatePhone(phoneNumber);
    const mailValidation = validateEmail(phoneNumber);
    if (phoneValidation.isValid) {
      setErrMessage("phone");
      setErrorModal(true); // Hiển thị modal lỗi
      setTimeout(() => setErrorModal(false), 3000); // Tự động đóng sau 3 giây
      // setZaloModal(true);
    } else if (mailValidation.isValid) {
      setErrMessage("mail");
      setErrorModal(true); // Hiển thị modal lỗi
      setTimeout(() => setErrorModal(false), 3000); // Tự động đóng sau 3 giây
      // setZaloModal(true);
    } else {
      setErrMessage(phoneValidation.message);
      setErrorModal(true); // Hiển thị modal lỗi
      setTimeout(() => setErrorModal(false), 3000); // Tự động đóng sau 3 giây
    }
  };

  const handleRePass = () => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setErrMessage(emailValidation.message);
      setErrorModal(true); // Hiển thị modal lỗi
      setTimeout(() => setErrorModal(false), 3000); // Tự động đóng sau 3 giây
    } else {
      setErrMessage("");
      setRepass(true);
    }
  };

  useEffect(() => {
    if (isOtp && countDown > 0) {
      const timer = setTimeout(() => {
        setCountDown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countDown === 0) {
      setCanResend(true);
    }
  }, [isOtp, countDown]);

  const handleLogin = async () => {
    // Validation
    if (!email || !pass) {
      openNotification("error", "Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      openNotification("error", "Lỗi", "Email không đúng định dạng");
      return;
    }

    const passValidation = validatePass(pass);
    if (!passValidation.isValid) {
      openNotification(
        "error",
        "Lỗi",
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt"
      );
      return;
    }

    // Login
    try {
      setLoading(true);
      const loginData = {
        username: email,
        password: pass,
      };
      
      console.log("📤 Sending login data:", loginData);
      const res = await userService.postLogin(loginData);
      console.log("✅ Login success:", res.data);
      
      // Lưu thông tin user và token
      localUserService.set(res.data);
      
      openNotification("success", "Thành công", "Đăng nhập thành công!");
      
      setTimeout(() => {
        dispatch(setLoginAction(res.data));
        setLoading(false);
        window.location.reload();
      }, 1000);
    } catch (err) {
      setLoading(false);
      console.error("❌ Login error:", err);
      console.error("📥 Response:", err.response?.data);
      
      const errorMeta = err.response?.data?.metadata;
      let errorMessage = "";
      
      if (typeof errorMeta === "object" && errorMeta?.message) {
        errorMessage = errorMeta.message;
      } else if (typeof errorMeta === "string") {
        errorMessage = errorMeta;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.";
      }
      
      openNotification("error", "Đăng nhập thất bại", errorMessage);
    }
  };

  const handleSignUp = async () => {
    const valiPass = validatePass(pass);
    const valiEmail = validateEmail(email);
    
    if (!email || !pass) {
      openNotification(
        "error",
        "Lỗi",
        "Không để trống tài khoản hoặc mật khẩu"
      );
      return;
    }
    
    if (!valiPass.isValid) {
      openNotification(
        "error",
        "Lỗi",
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt!"
      );
      return;
    }
    
    if (!valiEmail.isValid) {
      openNotification("error", "Lỗi", "Email không đúng định dạng!");
      return;
    }
    
    try {
      const signupForm = {
        username: email,
        password: pass,
      };
      const res = await userService.postSignUp(signupForm);
      setLoading(true);
      console.log(res);
      setTimeout(() => {
        setLoading(false);
        openNotification(
          "success",
          "Thành công",
          "Đăng ký thành công!"
        );
      }, 700);
      handleRePass();
    } catch (err) {
      setLoading(false);
      
      console.error("❌ Lỗi đăng Ký:", err);
      console.error("📥 Response data:", err.response?.data);
      console.error("📊 Response status:", err.response?.status);
      
      // Parse error message từ nhiều format khác nhau
      let errorMessage = "";
      const responseData = err.response?.data;
      
      if (responseData) {
        // Try metadata first
        const errorMeta = responseData.metadata;
        if (Array.isArray(errorMeta)) {
          errorMessage = errorMeta.map((item) => item.message).join("\n");
        } else if (typeof errorMeta === "object" && errorMeta?.message) {
          errorMessage = errorMeta.message;
        } else if (typeof errorMeta === "string") {
          errorMessage = errorMeta;
        }
        
        // Try direct message
        if (!errorMessage && responseData.message) {
          errorMessage = responseData.message;
        }
        
        // Try error field
        if (!errorMessage && responseData.error) {
          errorMessage = typeof responseData.error === 'string' 
            ? responseData.error 
            : JSON.stringify(responseData.error);
        }
      }
      
      // Fallback message
      if (!errorMessage) {
        errorMessage = "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin hoặc thử lại sau.";
      }

      openNotification("error", "Đăng ký thất bại", errorMessage);
    }
  };

  const handleResetPassword = async () => {
    // Validation
    if (!email) {
      openNotification("error", "Lỗi", "Vui lòng nhập email!");
      return;
    }

    const valiEmail = validateEmail(email);
    if (!valiEmail.isValid) {
      openNotification("error", "Lỗi", "Email không đúng định dạng!");
      return;
    }

    setLoading(true);
    try {
      const res = await appService.resetPassword(email);
      console.log("✅ OTP sent to:", email);
      setLoading(false);
      openNotification(
        "success",
        "Thành công",
        "Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra!"
      );
      setIsOtp(true); // Chuyển sang màn OTP
      setCanResend(false);
      setCountDown(60); // 60 giây để resend
    } catch (err) {
      setLoading(false);
      console.error("❌ Send OTP failed:", err);
      
      const errorMeta = err.response?.data?.metadata;
      let errorMessage = "";
      if (Array.isArray(errorMeta)) {
        errorMessage = errorMeta.map((item) => item.message).join("\n");
      } else if (typeof errorMeta === "object" && errorMeta?.message) {
        errorMessage = errorMeta.message;
      } else if (typeof errorMeta === "string") {
        errorMessage = errorMeta;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = "Không thể gửi mã OTP. Email có thể không tồn tại trong hệ thống.";
      }

      openNotification("error", "Gửi OTP thất bại", errorMessage);
    }
  };

  const handleChangePass = async () => {
    // Validation
    if (!np || !np2) {
      openNotification("error", "Lỗi", "Vui lòng nhập đầy đủ mật khẩu!");
      return;
    }

    if (np !== np2) {
      openNotification(
        "error",
        "Lỗi",
        "Mật khẩu và nhập lại mật khẩu không khớp!"
      );
      return;
    }

    const valiPass = validatePass(np);
    if (!valiPass.isValid) {
      openNotification(
        "error",
        "Lỗi",
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt!"
      );
      return;
    }

    setLoading(true);
    const data = {
      email: email,
      newPassword: np,
      confirmPassword: np2,
    };
    
    try {
      const res = await appService.resetPass(data);
      console.log("✅ Reset password success:", res);
      openNotification(
        "success",
        "Thành công",
        "Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại."
      );
      setTimeout(() => {
        setLoading(false);
        window.location.reload();
      }, 1500);
    } catch (error) {
      setLoading(false);
      console.error("❌ Reset password error:", error);
      const errorMeta = error.response?.data?.metadata;
      let errorMessage = "";
      if (Array.isArray(errorMeta)) {
        errorMessage = errorMeta.map((item) => item.message).join("\n");
      } else if (typeof errorMeta === "object" && errorMeta?.message) {
        errorMessage = errorMeta.message;
      } else if (typeof errorMeta === "string") {
        errorMessage = errorMeta;
      } else {
        errorMessage = "Đã xảy ra lỗi không xác định";
      }

      openNotification("error", "Thất bại", errorMessage);
    }
  };

  const handleCfOtp = async () => {
    // Validation
    if (!saveOtp || saveOtp.length !== 6) {
      openNotification("error", "Lỗi", "Vui lòng nhập đầy đủ mã OTP 6 số!");
      return;
    }

    setLoading(true);
    const formData = {
      email: email,
      otp: saveOtp,
      type: "FORGOT_PASSWORD",
    };
    
    try {
      const res = await appService.conformOtp(formData);
      console.log("✅ OTP verified:", res);
      setLoading(false);
      openNotification(
        "success",
        "Thành công",
        "Xác thực OTP thành công! Vui lòng đặt mật khẩu mới."
      );
      setIsOtp(false);
      setIsNewPass(true);
    } catch (err) {
      setLoading(false);
      console.error("❌ OTP verification failed:", err);
      
      const errorMeta = err?.response?.data?.metadata;
      let errorMessage = "";
      if (typeof errorMeta === "object" && errorMeta?.message) {
        errorMessage = errorMeta.message;
      } else if (typeof errorMeta === "string") {
        errorMessage = errorMeta;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = "Mã OTP không chính xác hoặc đã hết hạn!";
      }
      
      openNotification("error", "Xác thực thất bại", errorMessage);
    }
  };

  const handleXTOtp = async () => {
    const formData = {
      email: email,
      otp: saveOtp,
      type: "REGISTER",
    };
    try {
      await appService.conformOtp(formData);
      setLoading(true);
      setTimeout(() => {
        openNotification(
          "success",
          "Thành công",
          "Tài khoản xác thực thành công!"
        );
      }, 700);
      setTimeout(() => {
        setLoading(false);
        setIsXT(false);
        setIsDK(false);
      }, 1500);
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu xác thực:", err);
      openNotification(
        "error",
        "Lỗi",
        err?.response?.data?.metadata?.message || "Gửi yêu cầu thất bại"
      );
    }
  };

  const contentStyle = {
    marginTop: "20%",
  };

  const content = <div style={contentStyle} />;

  const handleGoogleLogin = () => {
    const backendURL = process.env.REACT_APP_BASE_URL2 || 'http://localhost:3000/api';
    window.location.href = `${backendURL}/auth/google`;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      {loading && (
        <div
          style={{
            width: "100%",
            position: "fixed",
            height: "100vh",
            zIndex: "1001",
            padding: "20px",
            background: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Spin tip="Loading" size="large">
            {content}
          </Spin>
        </div>
      )}
      {contextHolder}
      {/* login */}
      {!isRP && !isSms && !isOtp && !isDK && !isXT && (
        <div className="modal-container">
          {/* Nút đóng */}
          <button
            style={{
              position: "absolute",
              top: "1%",
              right: "1%",
              border: "none",
              background: "none",
              fontSize: "25px",
            }}
            onClick={handleOnclose}
          >
            <FaTimes />
          </button>

          {/* Tiêu đề */}
          <h2 className="modal-title">ĐĂNG NHẬP</h2>

          {/* Form nhập thông tin */}
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

            <a
              onClick={() => setIsRP(true)}
              style={{ color: "#1A81FF" }}
              className="forgot-password"
            >
              Quên mật khẩu?
            </a>

            <button onClick={handleLogin} className="login-button">
              ĐĂNG NHẬP
            </button>
            <a
              onClick={() => setIsSms(true)}
              style={{ cursor: "pointer", color: "#1A81FF" }}
              className="sms-login"
            >
              Đăng nhập bằng OTP
            </a>

            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="divider"></div>
              <div style={{ display: "block", margin: "0 5%" }}>Hoặc</div>
              <div className="divider"></div>
            </div>

            {/* Nút đăng nhập với Google và Facebook */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10%",
                marginBottom: "10px",
              }}
            >
              <img
                src={gg}
                alt="Google"
                style={{ width: "32px", cursor: "pointer" }}
                onClick={handleGoogleLogin}
              />
              <FaFacebook
                style={{
                  fontSize: "32px",
                  color: "#0866ff",
                  cursor: "pointer",
                }}
              />
            </div>
            <p
              style={{
                textAlign: "left",
                marginTop: "5%",
                fontSize: "12px",
                color: "black",
                fontWeight: "400",
                textAlign: "center",
              }}
            >
              Bạn mới biết đến VINE lần đầu?{" "}
              <span
                onClick={() => setIsDK(true)}
                style={{
                  color: "#1A81FF",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Đăng ký
              </span>
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: "50%" }}>
                <img src={rt} alt="Google" style={{ width: "50%" }} />
                <p
                  style={{
                    color: "black",
                    fontSize: "12px",
                    fontWeight: "400",
                    margin: "0",
                  }}
                >
                  FREE RETURN{" "}
                </p>
              </div>
              <div style={{ width: "50%" }}>
                <img src={sb} alt="Google" style={{ width: "50%" }} />
                <p
                  style={{
                    color: "black",
                    fontSize: "12px",
                    fontWeight: "400",
                    margin: "0",
                  }}
                >
                  SAFE SHOPPING
                </p>
              </div>
            </div>
            <p
              style={{
                color: "black",
                fontSize: "12px",
                fontWeight: "400",
                margin: "20px 0",
              }}
            >
              By continuing, you agree to our{" "}
              <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                Terms of Use
              </span>{" "}
              and{" "}
              <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </div>
      )}

      {/* dang ky */}
      {!isRP && !isSms && !isOtp && isDK && !isXT && (
        <div className="modal-container">
          {/* Nút đóng */}
          <button
            style={{
              position: "absolute",
              top: "1%",
              right: "1%",
              border: "none",
              background: "none",
              fontSize: "25px",
            }}
            onClick={handleOnclose}
          >
            <FaTimes />
          </button>

          {/* Tiêu đề */}
          <h2 className="modal-title">ĐĂNG KÝ</h2>
          {/* Form nhập thông tin */}
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

            <button
              onClick={handleSignUp}
              className="login-button"
              style={{ marginTop: "10px" }}
            >
              ĐĂNG KÝ
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="divider"></div>
              <div style={{ display: "block", margin: "0 5%" }}>Hoặc</div>
              <div className="divider"></div>
            </div>

            {/* Nút đăng nhập với Google và Facebook */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10%",
                marginBottom: "10px",
              }}
            >
              <img
                src={gg}
                alt="Google"
                style={{ width: "32px", cursor: "pointer" }}
                onClick={handleGoogleLogin}
              />
              <FaFacebook
                style={{
                  fontSize: "32px",
                  color: "#0866ff",
                  cursor: "pointer",
                }}
              />
            </div>
            <p
              style={{
                textAlign: "left",
                marginTop: "5%",
                fontSize: "12px",
                color: "black",
                fontWeight: "400",
                textAlign: "center",
              }}
            >
              Bạn đã có tài khoản?{" "}
              <span
                onClick={() => {
                  setIsDK(false);
                }}
                style={{
                  color: "#1A81FF",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Đăng nhập
              </span>
            </p>

            <p
              style={{
                color: "black",
                fontSize: "12px",
                fontWeight: "400",
                margin: "20px 0",
              }}
            >
              By continuing, you agree to our{" "}
              <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                Terms of Use
              </span>{" "}
              and{" "}
              <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </div>
      )}

      {/* quen mk */}
      {isRP && !isOtp && !isSms && !isNewPass && (
        <div
          style={{
            padding: "3%",
          }}
          className="modal-container"
        >
          {/* Nút đóng */}
          <button
            style={{
              position: "absolute",
              top: "1%",
              right: "1%",
              border: "none",
              background: "none",
              fontSize: "25px",
            }}
            onClick={handleOnclose}
          >
            <FaTimes />
          </button>

          {/* Tiêu đề */}
          <h2
            style={{
              fontSize: "34px",
              fontWeight: "400",
              marginBottom: "5%",
            }}
            className="modal-title"
          >
            Đặt lại mật khẩu
          </h2>

          {/* Form nhập thông tin */}
          <div className="modal-body">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              placeholder="Nhập tài khoản / email"
              style={{
                marginBottom: "5%",
              }}
            />
            <button
              className="login-button"
              onClick={() => {
                handleResetPassword();
              }}
              style={{ marginTop: "10px" }}
            >
              TIẾP TỤC
            </button>

            {errorModal && (
              <div className="error-modal">
                <p>{errMessage}</p>
              </div>
            )}
            <ModalRP
              isOpen={repass}
              onClose={() => setRepass(false)}
              email={email}
              onSendOtp={() => {
                setIsOtp(true); // Chuyển sang màn OTP
                setCanResend(false);
                setCountDown(12); // Reset thời gian OTP
              }}
            />
            <a
              onClick={() => setIsRP(false)}
              style={{
                cursor: "pointer",
                position: "absolute",
                top: "-100%",
                left: "0",
              }}
              className="forgot-password"
            >
              <IoIosArrowRoundBack
                style={{
                  fontSize: "25px",
                  color: "#1A81FF",
                }}
              />
            </a>
          </div>
        </div>
      )}

      {/* Màn hình nhập số điện thoại (SMS) */}
      {isSms && !isOtp && (
        <div
          style={{
            padding: "3%",
          }}
          className="modal-container"
        >
          {/* Nút đóng */}
          <button
            style={{
              position: "absolute",
              top: "1%",
              right: "1%",
              border: "none",
              background: "none",
              fontSize: "25px",
            }}
            onClick={handleOnclose}
          >
            <FaTimes />
          </button>

          {/* Tiêu đề */}
          <h2
            style={{
              color: "black",
            }}
            className="modal-title"
          >
            ĐĂNG NHẬP
          </h2>

          {/* Form nhập thông tin */}
          <div className="modal-body">
            <label>Tên đăng nhập</label>
            <input
              onChange={(e) => setPhoneNumber(e.target.value)}
              type="text"
              placeholder="Email hoặc số điện thoại"
            />
            <button
              className="login-button"
              onClick={handleOtp}
              style={{ marginTop: "10px" }}
            >
              TIẾP TỤC
            </button>

            {errorModal && (
              <div className="error-modal">
                <p style={{ color: "red" }}>{errMessage}</p>
              </div>
            )}
            <ZaloModal
              isOpen={zaloModal}
              onClose={() => setZaloModal(false)}
              phoneNumber={phoneNumber}
              onSendOtp={() => {
                setIsOtp(true); // Chuyển sang màn OTP
                setCanResend(false);
                setCountDown(12); // Reset thời gian OTP
              }}
            />
            <a
              onClick={() => setIsSms(false)}
              style={{ cursor: "pointer", color: "#1A81FF" }}
              className="forgot-password"
            >
              Đăng nhập bằng mật khẩu
            </a>

            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="divider"></div>
              <div style={{ display: "block", margin: "0 5%" }}>Hoặc</div>
              <div className="divider"></div>
            </div>

            {/* Nút đăng nhập với Google và Facebook */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10%",
                marginBottom: "10px",
              }}
            >
              <img
                src={gg}
                alt="Google"
                style={{ width: "32px", cursor: "pointer" }}
                onClick={handleGoogleLogin}
              />

              <FaFacebook
                style={{
                  fontSize: "32px",
                  color: "#0866ff",
                  cursor: "pointer",
                }}
              />
            </div>
            <p
              style={{
                textAlign: "left",
                marginTop: "5%",
                fontSize: "12px",
                color: "black",
                fontWeight: "400",
                textAlign: "center",
              }}
            >
              Bạn mới biết đến VINE lần đầu?{" "}
              <span
                onClick={() => {
                  setIsDK(true);
                  setIsSms(false);
                }}
                style={{
                  color: "#1A81FF",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Đăng ký
              </span>
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: "50%" }}>
                <img src={rt} alt="Google" style={{ width: "50%" }} />
                <p
                  style={{
                    color: "black",
                    fontSize: "12px",
                    fontWeight: "400",
                    margin: "0",
                  }}
                >
                  FREE RETURN{" "}
                </p>
              </div>
              <div style={{ width: "50%" }}>
                <img src={sb} alt="Google" style={{ width: "50%" }} />
                <p
                  style={{
                    color: "black",
                    fontSize: "12px",
                    fontWeight: "400",
                    margin: "0",
                  }}
                >
                  SAFE SHOPPING
                </p>
              </div>
            </div>
            <p
              style={{
                color: "black",
                fontSize: "12px",
                fontWeight: "400",
                margin: "20px 0",
              }}
            >
              By continuing, you agree to our{" "}
              <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                Terms of Use
              </span>{" "}
              and{" "}
              <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </div>
      )}

      {/* Màn hình nhập OTP */}
      {isOtp && (
        <div
          style={{
            padding: "3%",
          }}
          className="modal-container"
        >
          {/* Nút đóng */}
          <button
            style={{
              position: "absolute",
              top: "1%",
              right: "1%",
              border: "none",
              background: "none",
              fontSize: "25px",
            }}
            onClick={handleOnclose}
          >
            <FaTimes />
          </button>

          {/* Tiêu đề */}
          <h2
            style={{
              fontSize: "34px",
            }}
            className="modal-title"
          >
            Mã OTP
          </h2>
          <p
            className="otp-message"
            style={{
              color: "black",
              fontWeight: "500",
              fontSize: "12px",
              padding: "0 5%",
            }}
          >
            Chúng tôi đã gửi mã xác thực OTP đến email của bạn. Vui lòng kiểm
            tra hộp thư đến (hoặc thư rác) và nhập mã để tiếp tục. <br />
          </p>

          {/* Ô nhập mã OTP */}
          <div className="otp-input-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="otp-input"
              />
            ))}
          </div>

          <button
            onClick={handleCfOtp}
            className="login-button"
            style={{
              marginTop: "5%",
              marginBottom: "10%",
              width: "80%",
              padding: "10px",
            }}
          >
            Xác nhận
          </button>
          <br />

          {canResend ? (
            <button
              style={{
                border: "none",
                marginTop: "2%",
                background: "none",
              }}
              onClick={handleResendCode}
            >
              Gửi lại mã
            </button>
          ) : (
            <p
              style={{
                marginTop: "1%",
                color: "black",
                fontSize: "14px",
              }}
            >
              Vui lòng đợi {countDown} giây để gửi lại
            </p>
          )}
        </div>
      )}

      {/* Xác thực tài khoản*/}
      {isXT && (
        <div className="modal-container">
          {/* Nút đóng */}
          <button
            style={{
              position: "absolute",
              top: "1%",
              right: "1%",
              border: "none",
              background: "none",
              fontSize: "25px",
            }}
            onClick={handleOnclose}
          >
            <FaTimes />
          </button>

          {/* Tiêu đề */}
          <h2 className="modal-title">Mã OTP</h2>
          <p
            className="otp-message"
            style={{ color: "black", fontWeight: "500" }}
          >
            Mã xác thực đã được gửi đến tài khoản <br />
            <span>email: {email}</span>
          </p>

          {/* Ô nhập mã OTP */}
          <div className="otp-input-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="otp-input"
              />
            ))}
          </div>

          <button
            onClick={handleXTOtp}
            className="login-button"
            style={{ marginTop: "10px" }}
          >
            TIẾP TỤC
          </button>

          <button
            style={{
              border: "none",
              marginTop: "2%",
              background: "none",
            }}
            onClick={handleResendCode}
          >
            Gửi lại mã
          </button>
        </div>
      )}

      {/* mật khẩu mới */}
      {isNewPass && (
        <div className="modal-container">
          {/* Nút đóng */}
          <button
            style={{
              position: "absolute",
              top: "1%",
              right: "1%",
              border: "none",
              background: "none",
              fontSize: "25px",
            }}
            onClick={handleOnclose}
          >
            <FaTimes />
          </button>

          {/* Tiêu đề */}
          <h2 className="modal-title">Đặt lại mật khẩu</h2>

          {/* Form nhập thông tin */}
          <div className="modal-body">
            <label>Mật khẩu mới</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={np}
                onChange={(e) => setNp(e.target.value)}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <label>Nhập lại mật khẩu</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={np2}
                onChange={(e) => setNp2(e.target.value)}
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
                marginTop: "10%",
                marginBottom: "10%",
              }}
              onClick={handleChangePass}
              className="login-button"
            >
              Thay đổi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
