import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Kiểm tra token - ưu tiên ACCESS_TOKEN, fallback sang token
  const isAuthenticated = 
    localStorage.getItem("ACCESS_TOKEN") || 
    localStorage.getItem("token");

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
