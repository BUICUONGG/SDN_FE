import React, { useRef } from "react";
import { Carousel, Button, Card } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const { Meta } = Card;

const OrtherProductShop = () => {
  const carouselRef = useRef();

  const products = [
    { id: 1, title: "Tất", price: "100.000đ", sold: "5k" },
    { id: 2, title: "Son", price: "200.000đ", sold: "2k" },
    { id: 3, title: "Quần ống rộng nữ", price: "300.000đ", sold: "1.5k" },
    { id: 4, title: "Ốp Iphone", price: "150.000đ", sold: "8k" },
    { id: 5, title: "Giấy ăn", price: "50.000đ", sold: "10k" },
  ];

  return (
    <div
      style={{
        position: "relative",
        padding: "2% 5%",
        marginTop: "5%",
      }}
    >
      {/* Tiêu đề */}
      <h3
        style={{
          fontWeight: "bold",
          color: "#333232",
          marginBottom: "15px",
          fontSize: "35px",
          marginLeft: "10%",
        }}
      >
        Các sản phẩm khác của shop
      </h3>

      {/* Nút điều hướng bên trái */}
      <Button
        icon={<LeftOutlined />}
        style={{
          position: "absolute",
          left: "5%",
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
            style={{ width: 150, textAlign: "center", borderRadius: "10px" }}
          >
            <div
              style={{
                height: "30vh",
                background: "#ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src="https://via.placeholder.com/100" alt="product" />
            </div>
            
            <div
              style={{
                marginTop: "10px",
                padding: "5%",
              }}
            >
              <Meta title={product.title} />
              <div style={{ color: "green", fontWeight: "bold" , marginTop: '10px'}}>
                {product.price}
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
          right: "5%",
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

export default OrtherProductShop;
