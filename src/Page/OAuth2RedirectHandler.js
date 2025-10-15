import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OAuth2RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const email = params.get("email");
    const firstName = params.get("firstName");
    const lastName = params.get("lastName");
    const avatar = params.get("avatar");
    const roles = JSON.parse(decodeURIComponent(params.get("roles") || "[]"));

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify({ email, firstName, lastName, avatar, roles }));

      navigate("/"); // về trang chủ
    } else {
      navigate("/login"); // fallback nếu lỗi
    }
  }, [location, navigate]);

  return <p>🔄 Đang xử lý đăng nhập Google...</p>;
};

export default OAuth2RedirectHandler;
