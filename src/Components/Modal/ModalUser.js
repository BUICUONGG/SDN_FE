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
  const [pass2, setPass2] = useState("");
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
    }else if(mailValidation.isValid){
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
        const res = await userService.postLogin(loginData);

        if (res.data.status === true && res.data.metadata) {
          localUserService.set(res.data);
          localStorage.setItem("token", "your_jwt_token");
          setTimeout(() => {
            openNotification("success", "Thành công", "Đăng nhập thành công!");
          }, 1000);
          setTimeout(() => {
            dispatch(setLoginAction(res.data));
            setLoading(false);
            window.location.reload();
          }, 1500);
        }
      } catch (err) {
        console.error("Lỗi đăng nhập:", err);
        setTimeout(() => {
          openNotification("error", "Lỗi", err?.response?.data?.metadata?.message);
          setLoading(false);
        }, 1500);
      }
    }
  };

  const handleSignUp = async () => {
    const valiPass = validatePass(pass);
    const valiEmail = validateEmail(email);
    if (!email || !pass || !pass2 || !phoneNumber) {
      openNotification(
        "error",
        "Lỗi",
        "Không để trống tài khoản hoặc mật khẩu"
      );
      return;
    }
    if (pass !== pass2) {
      openNotification(
        "error",
        "Lỗi",
        "Mật khẩu và nhập lại mật khẩu không giống nhau !"
      );
      return;
    }
    if (!valiPass.isValid) {
      openNotification(
        "error",
        "Lỗi",
        "Mật khẩu xác nhận phải đúng định dạng yêu cầu ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt!"
      );
      return;
    }
    if (!valiEmail.isValid) {
      openNotification("error", "Lỗi", "Email không đúng định dạng!");
      return;
    }
    try {
      const signupForm = {
        email: email,
        phone: phoneNumber,
        password: pass,
        confirmPassword: pass2,
      };
      const res = await userService.postSignUp(signupForm);
      setLoading(true);
      setTimeout(() => {
        setIsXT(true);
        setLoading(false);
      }, 700);
      handleRePass();
    } catch (err) {
      console.error("Lỗi đăng Ký:", err);
      const errorMeta = err.response?.data?.metadata;
        let errorMessage = '';
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

  const handleResetPassword = async () => {
    if (!email) {
      message.error("Vui lòng nhập email!");
      return;
    }
    
    
    try {
      const res = await appService.resetPassword(email);
      openNotification(
        "success",
        "Thành công",
        "Yêu cầu đặt lại mật khẩu đã được gửi!"
      );
      setIsOtp(true); // Chuyển sang màn OTP
      setCanResend(false);
      setCountDown(12);
    } catch (err) {
      const errorMeta = err.response?.data?.metadata;
        let errorMessage = '';
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

  const handleChangePass = async () => {
    if (np !== np2) {
      return console.log("sai mat khau");
    }

    const data = {
      email: email,
      newPassword: np,
      confirmPassword: np2,
    };
    try {
      const res = await appService.resetPass(data);
      console.log(res);
      openNotification(
        "success",
        "Thành công",
        "Cập nhật mật khẩu thành công!"
      );
      setTimeout(() => {
        setLoading(false);
        window.location.reload();
      }, 500);
    } catch (error) {
      console.log(error.response.data.metadata);
      const errorMeta = error.response?.data?.metadata;
        let errorMessage = '';
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
    const formData = {
      email: email,
      otp: saveOtp,
      type: "FORGOT_PASSWORD",
    };
    try {
      const res = await appService.conformOtp(formData);
      console.log(res);
      openNotification(
        "success",
        "Thành công",
        "Yêu cầu đặt lại mật khẩu đã được gửi!"
      );
      setIsOtp(false);
      setIsNewPass(true);
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu đặt lại mật khẩu:", err);
      openNotification(
        "error",
        "Lỗi",
        err?.response?.data?.metadata?.message || "Gửi yêu cầu thất bại"
      );
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
    window.location.href = "http://thanhnt-tech.id.vn/user-service/api/v1/account/login/google";
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
                display: 'flex',
                alignItems: 'center',
              }}
            >
            <div className="divider">
            </div>
            <div style={{ display: 'block', margin: '0 5%'}}>
              Hoặc
            </div>
            <div className="divider">
            </div>
            </div>

            {/* Nút đăng nhập với Google và Facebook */}
            <div style={{ display: "flex", justifyContent: "center", gap: "10%", marginBottom: '10px' }}>
  
              <img src={gg} alt="Google" style={{ width: "32px", cursor: 'pointer' }} onClick={handleGoogleLogin}/>
              <FaFacebook style={{fontSize: '32px', color: '#0866ff', cursor: 'pointer'}}/>
            </div>
            <p style={{ textAlign: "left", marginTop: "5%", fontSize: "12px", color: "black", fontWeight: '400', textAlign: 'center' }}>
              Bạn mới biết đến xmark lần đầu?{" "}
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
              <div style={{width: '50%'}}>
                <img src={rt} alt="Google" style={{ width: "50%" }} />
                <p style={{color: 'black', fontSize: '12px', fontWeight: '400', margin: '0'}}>FREE RETURN </p>
              </div>
              <div style={{width: '50%'}}>
                <img src={sb} alt="Google" style={{ width: "50%" }} />
                <p style={{color: 'black', fontSize: '12px', fontWeight: '400', margin: '0'}}>SAFE SHOPPING</p>
              </div>
            </div>
            <p style={{
              color: 'black',
              fontSize: '12px',
              fontWeight: '400',
              margin: '20px 0',
            }}>By continuing, you agree to our <span style={{textDecoration: 'underline', cursor: 'pointer'}}>Terms of Use</span> and <span style={{textDecoration: 'underline', cursor: 'pointer'}}>Privacy Policy</span>.</p>
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

            <label>Số điện thoại</label>
            <input
              onChange={(e) => setPhoneNumber(e.target.value)}
              value={phoneNumber}
              type="text"
              placeholder="Số điện thoại"
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

            <label>Nhập lại mật khẩu</label>
            <div className="password-container">
              <input
                type={showRePassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
              />
              <button
                onClick={() => setShowRePassword(!showRePassword)}
                className="toggle-password"
              >
                {showRePassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button onClick={handleSignUp} className="login-button" style={{marginTop:'10px'}}>
              ĐĂNG Ký
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
            <div className="divider">
            </div>
            <div style={{ display: 'block', margin: '0 5%'}}>
              Hoặc
            </div>
            <div className="divider">
            </div>
            </div>

            {/* Nút đăng nhập với Google và Facebook */}
            <div style={{ display: "flex", justifyContent: "center", gap: "10%", marginBottom: '10px' }}>
  
              <img src={gg} alt="Google" style={{ width: "32px", cursor: 'pointer' }} onClick={handleGoogleLogin}/>
              <FaFacebook style={{fontSize: '32px', color: '#0866ff', cursor: 'pointer'}}/>
            </div>
            <p style={{ textAlign: "left", marginTop: "5%", fontSize: "12px", color: "black", fontWeight: '400', textAlign: 'center' }}>
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
            
            <p style={{
              color: 'black',
              fontSize: '12px',
              fontWeight: '400',
              margin: '20px 0',
            }}>By continuing, you agree to our <span style={{textDecoration: 'underline', cursor: 'pointer'}}>Terms of Use</span> and <span style={{textDecoration: 'underline', cursor: 'pointer'}}>Privacy Policy</span>.</p>
          </div>
        </div>
      )}

      {/* quen mk */}
      {isRP && !isOtp && !isSms && !isNewPass && (
        <div style={{
          padding: '3%',
        }} className="modal-container">
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
          <h2 style={{
            fontSize: "34px",
            fontWeight: "400",
            marginBottom: "5%",
          }} className="modal-title">Đặt lại mật khẩu</h2>

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
              style={{marginTop:'10px'}}
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
              <IoIosArrowRoundBack style={{
                fontSize: "25px",
                color: "#1A81FF",
              }}/>
            </a>
          </div>
        </div>
      )}

      {/* Màn hình nhập số điện thoại (SMS) */}
      {isSms && !isOtp && (
        <div style={{
          padding: "3%",
        }} className="modal-container">
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
          <h2 style={{
            color: 'black'
          }} className="modal-title">ĐĂNG NHẬP</h2>

          {/* Form nhập thông tin */}
          <div className="modal-body">
            <label>Tên đăng nhập</label>
            <input
              onChange={(e) => setPhoneNumber(e.target.value)}
              type="text"
              placeholder="Email hoặc số điện thoại"
            />
            <button className="login-button" onClick={handleOtp} style={{marginTop:'10px'}}>
              TIẾP TỤC
            </button>

            {errorModal && (
              <div className="error-modal">
                <p style={{color: 'red'}}>{errMessage}</p>
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
              style={{ cursor: "pointer",
                color: "#1A81FF",
               }}
              className="forgot-password"
            >
              Đăng nhập bằng mật khẩu
            </a>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
            <div className="divider">
            </div>
            <div style={{ display: 'block', margin: '0 5%'}}>
              Hoặc
            </div>
            <div className="divider">
            </div>
            </div>
            

            {/* Nút đăng nhập với Google và Facebook */}
            <div style={{ display: "flex", justifyContent: "center", gap: "10%", marginBottom: '10px' }}>

              <img src={gg} alt="Google" style={{ width: "32px", cursor: 'pointer' }} onClick={handleGoogleLogin}/>
              
              <FaFacebook style={{fontSize: '32px', color: '#0866ff', cursor: 'pointer'}}/>
            </div>
            <p style={{ textAlign: "left", marginTop: "5%", fontSize: "12px", color: "black", fontWeight: '400', textAlign: 'center' }}>
              Bạn mới biết đến xmark lần đầu?{" "}
              <span
                onClick={() => {setIsDK(true)
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
              <div style={{width: '50%'}}>
                <img src={rt} alt="Google" style={{ width: "50%" }} />
                <p style={{color: 'black', fontSize: '12px', fontWeight: '400', margin: '0'}}>FREE RETURN </p>
              </div>
              <div style={{width: '50%'}}>
                <img src={sb} alt="Google" style={{ width: "50%" }} />
                <p style={{color: 'black', fontSize: '12px', fontWeight: '400', margin: '0'}}>SAFE SHOPPING</p>
              </div>
            </div>
            <p style={{
              color: 'black',
              fontSize: '12px',
              fontWeight: '400',
              margin: '20px 0',
            }}>By continuing, you agree to our <span style={{textDecoration: 'underline', cursor: 'pointer'}}>Terms of Use</span> and <span style={{textDecoration: 'underline', cursor: 'pointer'}}>Privacy Policy</span>.</p>
          </div>
        </div>
      )}

      {/* Màn hình nhập OTP */}
      {isOtp && (
        <div style={
          {
            padding: "3%",
          }
        } className="modal-container">
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
          <h2 style={{
            fontSize: "34px",
          }} className="modal-title">Mã OTP</h2>
          <p
            className="otp-message"
            style={{ color: "black", fontWeight: "500" , fontSize: '12px', padding: '0 5%'}}
          >
            Chúng tôi đã gửi mã xác thực OTP đến email của bạn. Vui lòng kiểm tra hộp thư đến (hoặc thư rác) và nhập mã để tiếp tục. <br />
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

          <button onClick={handleCfOtp} className="login-button" style={{marginTop:'5%',
            marginBottom: "10%",
            width: "80%",
            padding: "10px",
          }}>
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

          <button onClick={handleXTOtp} className="login-button" style={{marginTop:'10px'}}>
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

            <button style={{
              marginTop: "10%",
              marginBottom: "10%",
            }} onClick={handleChangePass} className="login-button">
              Thay đổi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
