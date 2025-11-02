import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { localUserService } from "../service/localService";
import { Player } from "@lottiefiles/react-lottie-player";
import animaSuccess from "../Components/UserCom/succes.json";
import { notification } from "antd";

const OAuth2RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const handleGoogleCallback = () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const error = params.get("error");

        if (error) {
          api.error({
            message: "Đăng nhập thất bại",
            description: "Không thể đăng nhập bằng Google. Vui lòng thử lại.",
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
          return;
        }

        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            
            const userData = {
              status: true,
              metadata: {
                _id: payload.user_id,
                username: payload.username,
                user_roles: payload.role || "Member",
              },
              accessToken: token,
            };

            localUserService.set(userData);
            localStorage.setItem("token", token);

            api.success({
              message: "Đăng nhập thành công",
              description: "Chào mừng bạn đã quay trở lại!",
            });

            setLoading(false);
            
            setTimeout(() => {
              navigate("/");
              window.location.reload();
            }, 1500);
          } catch (decodeError) {
            console.error("Error decoding token:", decodeError);
            api.error({
              message: "Lỗi",
              description: "Token không hợp lệ.",
            });
            setTimeout(() => navigate("/"), 2000);
          }
        } else {
          api.error({
            message: "Đăng nhập thất bại",
            description: "Không nhận được token từ server.",
          });
          setTimeout(() => navigate("/"), 2000);
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        api.error({
          message: "Lỗi",
          description: "Có lỗi xảy ra trong quá trình đăng nhập.",
        });
        setTimeout(() => navigate("/"), 2000);
      }
    };

    handleGoogleCallback();
  }, [location, navigate, api]);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#f8f9fa"
    }}>
      {contextHolder}
      {loading ? (
        <>
          <Player
            autoplay
            loop
            src={animaSuccess}
            style={{ height: "200px", width: "200px" }}
          />
          <p style={{ fontSize: "18px", color: "#666", marginTop: "20px" }}>
            🔄 Đang xử lý đăng nhập Google...
          </p>
        </>
      ) : (
        <>
          <Player
            autoplay
            src={animaSuccess}
            style={{ height: "200px", width: "200px" }}
          />
          <p style={{ fontSize: "18px", color: "#28a745", marginTop: "20px", fontWeight: "600" }}>
            ✅ Đăng nhập thành công!
          </p>
        </>
      )}
    </div>
  );
};

export default OAuth2RedirectHandler;
