import React, { useEffect, useState } from "react";
import { Tabs, Empty, Modal } from "antd";
import "./Ivb.css"; // import CSS tuỳ chỉnh
import { orderService } from "../../service/orderService";
import FancyLoadingPage from "../../Components/Spinner/FancyLoadingPage";

const orders = [
  {
    id: 1,
    shopName: "Dodana",
    status: "Đã giao",
    statusText: "Giao hàng thành công",
    isDone: true,
    deliveryDate: "07/12/2025",
    total: 39000,
    product: {
      name: "Quần Short Unisex Basic Thể Thao Mặc Thoáng Mát Phong Cách Hàn Quốc Nam Nữ Mặc Đẹp",
      quantity: 1,
      color: "Đen",
      size: "M",
      image: "https://cf.shopee.vn/file/9b3b6c9cf074abf1d15757f4e145e9aa_tn", // ví dụ ảnh thật
    },
  },
  {
    id: 2,
    shopName: "Dodana",
    status: "Đã giao",
    statusText: "Giao hàng thành công",
    isDone: true,
    deliveryDate: "07/12/2025",
    total: 39000,
    product: {
      name: "Quần Short Unisex Basic Thể Thao Mặc Thoáng Mát Phong Cách Hàn Quốc Nam Nữ Mặc Đẹp",
      quantity: 1,
      color: "Đen",
      size: "M",
      image: "https://cf.shopee.vn/file/9b3b6c9cf074abf1d15757f4e145e9aa_tn",
    },
  },
];

export default function InvationBuy() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    orderService
      .getOrder({
        currentPage: 0,
        pageSize: 10,
      })
      .then((res) => {
        setOrders(res.data.metadata.metadata || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
      });
  }, []);

  console.log(orders);
  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      {loading && <FancyLoadingPage />}
      <Tabs
        defaultActiveKey="all"
        className="custom-tabs"
        items={[
          {
            key: "all",
            label: "Tất cả",
            children:
              orders.length === 0 ? (
                <Empty description="Chưa có đơn hàng" />
              ) : (
                <AllOrder orders={orders} />
              ),
          },
          {
            key: "waitingpayment",
            label: "Chờ thanh toán",
            children: <Empty description="Chưa có đơn hàng" />,
          },
          {
            key: "waitingdelivered",
            label: "Chờ giao hàng",
            children: <Empty description="Chưa có đơn hàng" />,
          },
          { key: "delivered", label: "Đã giao", children: <DeliveredTab /> },
          {
            key: "cancelled",
            label: "Đã huỷ",
            children: <Empty description="Chưa có đơn hàng" />,
          },
          {
            key: "returned",
            label: "Trả lại",
            children: <Empty description="Chưa có đơn hàng" />,
          },
        ]}
      />
    </div>
  );
}

const DeliveredTab = () => {
  const deliveredOrders = orders.filter((order) => order.status === "Đã giao");

  return (
    <div style={{ padding: 20 }}>
      {deliveredOrders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #e5e5e5",
            marginBottom: 20,
            borderRadius: 6,
            overflow: "hidden",
            background: "#f6fff6",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: 10,
              background: "#fff",
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #eee",
            }}
          >
            <div>
              <strong>{order.shopName}</strong>
            </div>
            <div style={{ color: "green", fontWeight: "bold" }}>
              🚚 {order.statusText} –{" "}
              <span style={{ color: "#16a34a" }}>Hoàn thành</span>
            </div>
          </div>

          {/* Product */}
          <div style={{ display: "flex", padding: 10, background: "#fff" }}>
            <img
              src={order.product.image}
              alt="product"
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                marginRight: 10,
              }}
            />
            <div>
              <div style={{ fontWeight: 500 }}>{order.product.name}</div>
              <div style={{ color: "#666" }}>
                Phân loại: {order.product.color} / {order.product.size}
              </div>
              <div style={{ color: "#666" }}>x{order.product.quantity}</div>
            </div>
            <div style={{ marginLeft: "auto", fontWeight: "bold" }}>
              {order.total.toLocaleString("vi-VN")}₫
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              background: "#eaffea",
              padding: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              Đánh giá sản phẩm trước ngày <a href="#">{order.deliveryDate}</a>
            </div>
            <div>
              <button
                style={{
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: 4,
                }}
              >
                Đánh giá
              </button>
              <button style={{ marginLeft: 8, padding: "6px 12px" }}>
                Mua lại
              </button>
              <button style={{ marginLeft: 8, padding: "6px 12px" }}>
                Liên hệ người bán
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const AllOrder = ({ orders }) => {
  return (
    <div style={{ padding: 20 }}>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

const OrderCard = ({ order }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => {
    console.log(order.id)
    // orderService
    //   .cancelOrder(order.id)
    //   .then((res) => {
    //     console.log("Hủy đơn hàng thành công:", res.data);
    //     setIsModalOpen(false);
    //   })
    //   .catch((err) => {
    //     console.error("Lỗi khi hủy đơn hàng:", err);
    //   });
    alert('chức năng đang cập nhật')
  };
  const handleCancel = () => setIsModalOpen(false);

  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        marginBottom: 20,
        borderRadius: 6,
        overflow: "hidden",
        background: "#f6fff6",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 10,
          background: "#fff",
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #eee",
        }}
      >
        <div>
          <strong>{order.shopName}</strong>
        </div>
        <div style={{ color: "green", fontWeight: "bold" }}>
          🚚 {renderStatusText(order.status)} –{" "}
          <span style={{ color: "#16a34a" }}>{order.status}</span>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      {order.orderItems.map((item, idx) => (
        <div
          key={idx}
          style={{ display: "flex", padding: 10, background: "#fff" }}
        >
          <img
            src={item.imageUrl}
            alt="product"
            style={{
              width: 80,
              height: 80,
              objectFit: "cover",
              marginRight: 10,
            }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{item.productName}</div>
            <div style={{ color: "#666" }}>x{item.quantity}</div>
          </div>
          <div style={{ marginLeft: "auto", fontWeight: "bold" }}>
            {item.price.toLocaleString("vi-VN")}₫
          </div>
        </div>
      ))}

      {/* Footer */}
      <div
        style={{
          background: "#eaffea",
          padding: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          Mã đơn hàng: <strong>{order.orderCode}</strong>
        </div>
        <div>
          <button
            onClick={showModal}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: 4,
            }}
          >
            Hủy đơn
          </button>
          <button
            style={{
              background: "#16a34a",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: 4,
              marginLeft: 10,
            }}
          >
            Xem chi tiết
          </button>
        </div>
      </div>

      {/* Modal xác nhận hủy */}
      <Modal
        style={{ marginTop: "10%" }}
        title="Xác nhận hủy đơn hàng"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Hủy đơn"
        cancelText="Đóng"
      >
        <p>
          Bạn có chắc chắn muốn hủy đơn hàng <strong>{order.orderCode}</strong>{" "}
          không?
        </p>
      </Modal>
    </div>
  );
};

const renderStatusText = (status) => {
  switch (status) {
    case "PENDING":
      return "Chờ xác nhận";
    case "WAITING_PAYMENT":
      return "Chờ thanh toán";
    case "WAITING_PICKUP":
      return "Chờ lấy hàng";
    case "DELIVERED":
      return "Đã giao";
    case "CANCELLED":
      return "Đã huỷ";
    default:
      return "Đang xử lý";
  }
};
