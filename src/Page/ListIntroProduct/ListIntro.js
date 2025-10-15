import React from "react";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import '../../css/HomePage/ListIntro.css';
import banner1 from '../../img/banner/banner1.jpg';
import banner2 from '../../img/banner/banner2.jpg';
import banner3 from '../../img/banner/banner3.jpg';

const ListIntro = () => {
  const carouselRef = React.useRef();

  return (
    <div style={{ position: "relative", width: "100%", margin: "auto", padding: '1% 0' }}>
      {/* Nút điều hướng bên trái */}
      <button
        style={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          background: "gray",
          border: "none",
          width: "50px",
          height: "50px",
          color: "white",
          cursor: "pointer",
          zIndex: 10,
          borderTopRightRadius: '50%',
          borderBottomRightRadius: '50%',
          fontSize: '32px'
        }}
        onClick={() => carouselRef.current.prev()}
      >
        <LeftOutlined />
      </button>

      {/* Carousel */}
      <Carousel
        ref={carouselRef}
        autoplay
        dots={{ className: "custom-dots" }}
        dotPosition="bottom"
      >
        {[banner1, banner2, banner3].map((banner, index) => (
          <div key={index}>
            <div
              style={{
                height: "60vh",
                background: "#ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={banner}
                alt={`banner ${index + 1}`}
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        ))}
      </Carousel>

      {/* Nút điều hướng bên phải */}
      <button
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          background: "gray",
          border: "none",
          width: "50px",
          height: "50px",
          color: "white",
          cursor: "pointer",
          zIndex: 10,
          borderTopLeftRadius: '50%',
          borderBottomLeftRadius: '50%',
          fontSize: '32px'
        }}
        onClick={() => carouselRef.current.next()}
      >
        <RightOutlined />
      </button>
    </div>
  );
};

export default ListIntro;
