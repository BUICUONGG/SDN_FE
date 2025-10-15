import React, { useState, useEffect } from "react";
import { Carousel, Card } from "antd";
import "./dali.css";
import { appService } from "../../service/appService";
import { useNavigate } from "react-router-dom";
import FancyLoadingPage from "../../Components/Spinner/FancyLoadingPage";

const { Meta } = Card;

const DailyDeals = () => {
  const [products, setProducts] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 12;
  const navigate = useNavigate();
  // State cho bộ đếm thời gian
  const [timeLeft, setTimeLeft] = useState({
    hours: 7,
    minutes: 12,
    seconds: 5,
  });

  const fetchProducts = async (page, tab) => {
    setLoading(true);
    try {
      const response = await appService.getAllProduct(page, pageSize);
      let data = response?.data?.metadata?.metadata || [];

      // Nếu có tab lọc theo trạng thái
      if (tab !== "Tất cả") {
        data = data.filter((product) => product.status === tab);
      }

      // ⚠️ Chỉ lấy 6 sản phẩm đầu tiên
      setProducts(data.slice(0, 6));

      const total = response.data?.pagination?.totalElements || data.length;
      setTotalPages(Math.ceil(total / pageSize));
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, selectedTab);
  }, [currentPage, selectedTab]);

  return (
    <div>
      {loading && (
        <FancyLoadingPage />
      )}
      {/* Tiêu đề */}
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <h3
          style={{
            fontWeight: "700",
            margin: 0,
            color: "#0C4006",
            fontSize: "32px",
          }}
        >
          Sản Phẩm Theo Trend
        </h3>
      </div>

      {/* Carousel chứa danh sách sản phẩm */}
      <div
        style={{
          padding: "1%",
          background: "linear-gradient(45deg, #FFFFFF 0%, #DDE7DE 86%)",
          boxShadow: "1px 5px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        <Carousel slidesToShow={6} dots={true}>
          {products.map((product) => (
            <Card
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              hoverable
              style={{
                width: 120,
                textAlign: "center",
                boxShadow: "1px 5px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  height: "250px", // hoặc tuỳ chỉnh
                  background: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderRadius: "8px"
                }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top",
                    borderRadius: "6px"
                  }}
                />
              </div>
              <div style={{ padding: "10%" }}>
                <Meta title={product.name} />
                <div
                  style={{
                    marginTop: "10px",
                  }}
                >
                  <div style={{ color: "green", fontWeight: "bold" }}>
                    {product.resalePrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

// Style cho đồng hồ đếm ngược
const timerStyle = {
  background: "#ddd",
  padding: "5px 10px",
  margin: "0 3px",
  fontSize: "18px",
  fontWeight: "bold",
};

export default DailyDeals;
