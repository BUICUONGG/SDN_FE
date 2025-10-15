import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.subtitle}>Oops! Trang bạn tìm kiếm không tồn tại.</p>
      <Button type="primary" style={styles.button} onClick={() => navigate("/")}>
        Quay về trang chủ
      </Button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
    textAlign: "center",
  },
  title: {
    fontSize: "80px",
    fontWeight: "bold",
    color: "#1890ff",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "20px",
    color: "#555",
    marginBottom: "20px",
  },
  button: {
    fontSize: "16px",
    padding: "10px 20px",
    borderRadius: "5px",
  },
};

export default ErrorPage;
