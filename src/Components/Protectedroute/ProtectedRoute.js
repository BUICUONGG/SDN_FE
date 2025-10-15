import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Kiểm tra token

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
