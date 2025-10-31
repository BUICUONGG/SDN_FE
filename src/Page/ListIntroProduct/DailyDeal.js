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

  const fetchProducts = async () => {
    // setLoading(true);
    try {
      const response = await appService.getAllProduct();
      let data = response?.data?.products || [];

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
    fetchProducts();
  }, []);

  console.log(products);

  return (
    <div>
      {loading && <FancyLoadingPage />}
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
              key={product._id}
              hoverable
              onClick={() => navigate(`/product/${product._id}`)}
              style={{
                width: 240,
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              {/* Ảnh sản phẩm */}
              <div
                style={{
                  height: "180px",
                  background: "#fafafa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={product.image_url || "/placeholder.png"}
                  alt={product.slug}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              </div>

              {/* Nội dung */}
              <div style={{ padding: "12px 16px", textAlign: "left" }}>
                <Meta
                  title={
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#222",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {product.slug}
                    </div>
                  }
                  description={
                    <div style={{ marginTop: "8px" }}>
                      <div
                        style={{
                          color: "#4CAF50",
                          fontWeight: 700,
                          fontSize: "15px",
                        }}
                      >
                        {product.price?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </div>
                      <div
                        style={{
                          color: "#888",
                          fontSize: "13px",
                          marginTop: "4px",
                        }}
                      >
                        {product.brand?.name || "Tesla"}
                      </div>
                    </div>
                  }
                />
              </div>
            </Card>
          ))}
        </Carousel>
      </div>
    </div>
  );
};


export default DailyDeals;
