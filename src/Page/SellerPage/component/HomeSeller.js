import React, { useState } from "react";
import "./mainSel.css";
import { CheckCircleOutlined } from "@ant-design/icons";
import { ImNotification } from "react-icons/im";
import ShippingAddressModal from "./ShippingAddressModal";
import { useNavigate } from "react-router-dom";
import ChinhSachmodal from "./ChinhSachmodal";


export default function HomeSeller() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const navigate = useNavigate();
  const handleSaveAddress = (values) => {
    console.log("Địa chỉ lưu:", values);
    setIsModalVisible(false);
  };

  const handleSaveCS = (values) => {
    console.log("Địa chỉ lưu:", values);
    setIsModalVisible2(false);
  };
  return (
    <div
      style={{
        background: "rgb(247, 247, 247)",
      }}
      className="home-seller-container"
    >

      <h2>4 bước để bắt đầu</h2>
      <p>
        Để cài đặt cho cửa hàng của bạn và bắt đầu bán hàng, hãy chuẩn bị sẵn
        thông tin CCCD và chi tiết kho hàng của bạn.
      </p>

      {/* Xác minh doanh nghiệp */}
      <div className="card">
        <h3>Xác minh doanh nghiệp</h3>
        <div className="card-item success">
          <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
          <div>
            <strong>Đăng ký doanh nghiệp của bạn</strong>
            <p>
              Đơn đăng ký của bạn đang được xem xét. Chúng tôi sẽ cập nhật trạng
              thái trong vòng 72 giờ.
            </p>
          </div>
        </div>
      </div>

      {/* Sẵn sàng để bán hàng */}
      <div className="card">
        <h3>Sẵn sàng để bán hàng</h3>
        <div className="card-item">
          <input type="radio" />
          <div>
            <strong>Cài đặt vận chuyển</strong>
            <p>Xác định khu vực giao hàng và mức phí áp dụng cho khu vực.</p>
          </div>
          <a
            href="#"
            className="action-link"
            onClick={(e) => {
              e.preventDefault();
              setIsModalVisible(true);
            }}
          >
            Sửa
          </a>
        </div>
        <div className="card-item">
          <input type="radio" />
          <div>
            <strong>Thêm sản phẩm của bạn</strong>
            <p>
              Bắt đầu thiết lập hàng tồn kho cho cửa hàng bằng cách thêm các sản
              phẩm phổ biến nhất.
            </p>
          </div>
          <a
          onClick={()=>{
            navigate('/seller-page/addProduct')
          }}
          href="#" className="action-link">
            Sửa
          </a>
        </div>
      </div>

      <ShippingAddressModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSaveAddress}
      />
      {/* Chính sách */}
      <div className="card">
        <h3>Chính sách</h3>
        <div className="card-item">
          <input type="radio" />
          <div>
            <strong>Chính sách bán hàng (tùy chọn)</strong>
            <p>
              Chính sách rõ ràng sẽ giúp khách hàng tin tưởng và dễ dàng quyết
              định mua hàng hơn.
            </p>
          </div>
          <a
            href="#"
            className="action-link"
            onClick={(e) => {
              e.preventDefault();
              setIsModalVisible2(true);
            }}
          >
            Xem
          </a>
        </div>
      </div>
      <ChinhSachmodal
        visible={isModalVisible2}
        onCancel={() => setIsModalVisible2(false)}
        onOk={handleSaveCS}
      />
    </div>
  );
}
