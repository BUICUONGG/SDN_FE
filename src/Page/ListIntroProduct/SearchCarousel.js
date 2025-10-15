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
    setLoading(true);
    try {
      const response = await appService.getAllProduct(0, pageSize);
      setProducts(response.data.metadata.metadata);
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
            key={product.id}
            hoverable
            onClick={() => navigate(`/product/${product.id}`)}
            style={{ width: 150, textAlign: "center", borderRadius: "10px" }}
          >
            <div
              style={{
                height: "250px", // bạn có thể điều chỉnh tùy theo khung
                background: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                borderRadius: "8px",
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
                  borderRadius: "6px",
                }}
              />
            </div>

            <div
              style={{
                marginTop: "10px",
                padding: "5%",
              }}
            >
              <Meta title={product.name} />
              <div
                style={{
                  color: "green",
                  fontWeight: "bold",
                  marginTop: "10px",
                }}
              >
                {product.resalePrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </div>
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
