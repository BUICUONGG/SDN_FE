import React, { useEffect, useRef, useState } from "react";
import { Carousel, Button, Card } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { appService } from "../../service/appService";
import FancyLoadingPage from "../../Components/Spinner/FancyLoadingPage";

const { Meta } = Card;

const SearchCarousel = () => {
  const [products, setProducts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const pageSize = 0;
  const navigate = useNavigate();
  const carouselRef = useRef();

  const fetchProducts = async () => {
    // setLoading(true);
    try {
      const response = await appService.getAllProduct();
      setProducts(response.data.products);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(products);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #FFFFFF 0%, #DDE7DE 86%)",
        position: "relative",
        padding: "2% 10%",
        marginTop: "5%",
      }}
    >
      {loading && (
        <FancyLoadingPage />
      )}
      {/* Tiêu đề */}
      <h3
        style={{
          fontWeight: "bold",
          marginBottom: "15px",
          color: "#6EB566",
          fontSize: "35px",
          marginLeft: "5%",
        }}
      >
        Gợi ý cho bạn hôm nay
      </h3>

      {/* Nút điều hướng bên trái */}
      <Button
        icon={<LeftOutlined />}
        
        style={{
          position: "absolute",
          left: "10%",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(221, 221, 221, 0.5)",
          borderBottomRightRadius: "50%",
          borderTopRightRadius: "50%",
          zIndex: 10,
        }}
        onClick={() => carouselRef.current.prev()}
      />

      {/* Carousel */}
      <Carousel ref={carouselRef} dots={false} slidesToShow={6}>
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
      src={product.image_url[0] || "/placeholder.png"}
      alt={product.slug}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transition: "transform 0.3s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
          <div style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>
            {product.brand?.name || "Tesla"}
          </div>
        </div>
      }
    />
  </div>
</Card>

        ))}
      </Carousel>

      {/* Nút điều hướng bên phải */}
      <Button
        icon={<RightOutlined />}
        style={{
          position: "absolute",
          right: "10%",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(221, 221, 221, 0.5)",
          borderBottomLeftRadius: "50%",
          borderTopLeftRadius: "50%",
          zIndex: 10,
        }}
        onClick={() => carouselRef.current.next()}
      />
    </div>
  );
};

export default SearchCarousel;
