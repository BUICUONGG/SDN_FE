import React from "react";
import { useLocation } from "react-router-dom";
import { appService } from "../../service/appService";
import "./WaitForPayment.css"; // 👈 nhớ import file CSS

const WaitForPayment = () => {
  const location = useLocation();
  const { orderIds } = location.state || {};

  const handlePayment = async (orderId) => {
    try {
      const res = await appService.CreatePayment(orderId);
      if (res.data.status && res.data.metadata.payUrl) {
        window.location.href = res.data.metadata.payUrl;
      } else {
        alert("Không thể tạo thanh toán cho đơn hàng này.");
        console.warn(res.data.metadata);
      }
    } catch (err) {
      console.error("Lỗi tạo thanh toán:", err.response?.data || err.message);
    }
  };

  if (!orderIds || orderIds.length === 0) {
    return <p className="no-orders">Không có đơn hàng nào cần thanh toán.</p>;
  }

  return (
    <div className="payment-container">
      <h2 className="payment-title">Chờ thanh toán</h2>
      <ul className="payment-list">
        {orderIds.map((id) => (
          <li key={id} className="payment-item">
            <span className="order-id">Đơn hàng: {id}</span>
            <button className="pay-button" onClick={() => handlePayment(id)}>
              Thanh toán với Momo
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WaitForPayment;
