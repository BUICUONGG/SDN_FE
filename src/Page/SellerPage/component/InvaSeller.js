import React, { useEffect, useState } from "react";
import { orderService } from "../../../service/orderService";
import { Modal } from "antd";

const TABS = [
  { label: "Tất cả", status: "" },
  { label: "Chờ xác nhận", status: "PENDING" },
  { label: "Chờ lấy hàng", status: "WAITING_PICKUP" },
  { label: "Đang giao", status: "DELIVERING" },
  { label: "Đã giao", status: "DELIVERED" },
  { label: "Trả hàng/Hoàn tiền/Hủy", status: "CANCELLED" },
];

export default function InvaSeller() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // bắt đầu từ 1
  const pageSize = 6;
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const criteria = {
          currentPage: currentPage, // vì backend đếm từ 0
          pageSize,
          ...(statusFilter && { orderStatus: statusFilter }),
        };
        console.log(criteria)
        const res = await orderService.getAllOrder(criteria);
        setOrders(res.data.metadata.metadata || []);
        setTotalPages(res.data.metadata.maxPage || 1);
      } catch (error) {
        console.error("Lỗi lấy danh sách đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [statusFilter, currentPage]);

  const handleViewDetail = async (orderCode) => {
    try {
      const res = await orderService.getOrderDetail(orderCode);
      console.log(res)
      setOrderDetail(res.data.metadata);
      setSelectedOrder(orderCode);
      setDetailVisible(true);
    } catch (err) {
      console.error("Lỗi lấy chi tiết đơn hàng:", err);
    }
  };

  const handleConform = async (orderCode) => {
    try {
      const res = await orderService.conformOrder(orderCode);
      Modal.success({
        title: "Đã xác nhận đơn hàng",
        content: `Đơn hàng ${orderCode} đã được xác nhận thành công.`,
      });
      setDetailVisible(false);

      // Reload đơn hàng
      const criteria = {
        currentPage: currentPage - 1,
        pageSize,
        ...(statusFilter && { orderStatus: statusFilter }),
      };
      const updated = await orderService.getAllOrder(criteria);
      setOrders(updated.data.metadata.metadata || []);
      setTotalPages(updated.data.metadata.maxPage || 1);
    } catch (err) {
      console.error("Lỗi khi xác nhận đơn hàng:", err);
      Modal.error({
        title: "Lỗi xác nhận đơn",
        content: "Không thể xác nhận đơn hàng. Vui lòng thử lại.",
      });
    }
  };

  const conditionMap = {
    PENDING: "Chờ xác nhận",
    SHOP_CONFIRMED: "Đã xác nhận",
    DELIVERING: "Đang giao",
    DELIVERED: "Đã giao",
    CANCELLED: "Đã hủy",
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: 16 }}>Quản lý đơn hàng</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        {TABS.map((tab, index) => (
          <button
            key={index}
            onClick={() => {
              setStatusFilter(tab.status);
              setCurrentPage(1); // reset về page 1 khi chọn tab
            }}
            style={{
              padding: "8px 16px",
              border: "none",
              borderBottom:
                statusFilter === tab.status
                  ? "3px solid green"
                  : "3px solid transparent",
              background: "none",
              cursor: "pointer",
              color: statusFilter === tab.status ? "green" : "black",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14,
          background: "#fff",
        }}
      >
        <thead style={{ background: "#f9f9f9" }}>
          <tr>
            <th style={thStyle}>
              <input type="checkbox" />
            </th>
            <th style={thStyle}>Đơn hàng</th>
            <th style={thStyle}>Khách hàng</th>
            <th style={thStyle}>Tiền hàng</th>
            <th style={thStyle}>Trạng thái</th>
            <th style={thStyle}>Vận chuyển</th>
            <th style={thStyle}>Giao hàng</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                Đang tải...
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>
                  <input type="checkbox" />
                </td>
                <td
                  style={{ ...tdStyle, color: "green", cursor: "pointer" }}
                  onClick={() => handleViewDetail(order.orderCode)}
                >
                  #{order.orderCode}
                </td>
                <td style={tdStyle}>{order.customerName}</td>
                <td style={tdStyle}>{order.price.toLocaleString()}₫</td>
                <td style={tdStyle}>
                  {conditionMap[order.status] || "Không rõ"}
                </td>
                <td style={tdStyle}>GHN</td>
                <td style={tdStyle}>Lấy tại kho</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={pageButtonStyle}
        >
          «
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              ...pageButtonStyle,
              backgroundColor: currentPage === page ? "green" : "white",
              color: currentPage === page ? "white" : "black",
              fontWeight: currentPage === page ? "bold" : "normal",
            }}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          style={pageButtonStyle}
        >
          »
        </button>
      </div>

      <p
        style={{
          fontSize: 12,
          color: "#888",
          textAlign: "right",
          marginTop: 12,
        }}
      >
        Chỉ hiển thị đơn hàng trong 12 tháng qua
      </p>

      {/* Modal hiển thị chi tiết đơn hàng (giữ nguyên như bạn đã làm) */}
      {/* Bạn có thể copy phần modal chi tiết từ code trước để tránh trùng lặp quá dài ở đây */}
      <Modal
        title={
          <span style={{ fontSize: 18, fontWeight: "bold" }}>
            🧾 Chi tiết đơn hàng #{selectedOrder}
          </span>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
        bodyStyle={{ padding: 24, background: "#fdfdfd" }}
      >
        {orderDetail ? (
          <div>
            {/* Thông tin khách hàng & địa chỉ */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 8, color: "#333" }}>
                📦 Thông tin giao hàng
              </h3>
              <div style={{ lineHeight: 1.6 }}>
                <p
                  style={{
                    color: "black",
                  }}
                >
                  <strong>👤 Khách hàng:</strong> {orderDetail.customerName}
                </p>
                <p
                  style={{
                    color: "black",
                  }}
                >
                  <strong>📞 Số điện thoại:</strong> {orderDetail.customerPhone}
                </p>
                <p
                  style={{
                    color: "black",
                  }}
                >
                  <strong>📍 Địa chỉ:</strong> {orderDetail.shippingAddress}
                </p>
                {orderDetail.note && (
                  <p
                    style={{
                      color: "black",
                    }}
                  >
                    <strong>📝 Ghi chú:</strong> {orderDetail.note}
                  </p>
                )}
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 8, color: "#333" }}>
                🛍️ Sản phẩm đã đặt
              </h3>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                }}
              >
                <thead style={{ background: "#f0f0f0" }}>
                  <tr>
                    <th style={tableThStyle}>Sản phẩm</th>
                    <th style={tableThStyle}>Hình ảnh</th>
                    <th style={tableThStyle}>Số lượng</th>
                    <th style={tableThStyle}>Đơn giá</th>
                    <th style={tableThStyle}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetail.orderItems.map((item, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={tableTdStyle}>{item.productName}</td>
                      <td style={tableTdStyle}>
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          style={{ width: 60, borderRadius: 4 }}
                        />
                      </td>
                      <td style={tableTdStyle}>{item.quantity}</td>
                      <td style={tableTdStyle}>
                        {item.price.toLocaleString()}₫
                      </td>
                      <td style={tableTdStyle}>
                        {(item.price * item.quantity).toLocaleString()}₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tổng thanh toán */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  width: "40%",
                }}
              >
                <button
                  onClick={() => handleConform(selectedOrder)}
                  style={{
                    border: "none",
                    padding: "5%",
                    marginTop: "10%",
                  }}
                >
                  Xác nhận đơn hàng
                </button>
              </div>
              <div
                style={{
                  borderTop: "1px solid #eee",
                  paddingTop: 16,
                  textAlign: "right",
                }}
              >
                <p
                  style={{
                    color: "black",
                  }}
                >
                  <strong>Tạm tính:</strong>{" "}
                  {orderDetail.totalPrice.toLocaleString()}₫
                </p>
                <p
                  style={{
                    color: "black",
                  }}
                >
                  <strong>Phí vận chuyển:</strong>{" "}
                  {orderDetail.totalShippingFee.toLocaleString()}₫
                </p>
                <p
                  style={{ fontSize: 18, fontWeight: "bold", color: "#27ae60" }}
                >
                  Tổng thanh toán: {orderDetail.totalAmount.toLocaleString()}₫
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p>Đang tải chi tiết đơn hàng...</p>
        )}
      </Modal>
    </div>
  );
}

// Styles
const buttonStyle = {
  padding: "6px 12px",
  background: "#f0f0f0",
  border: "1px solid #ddd",
  borderRadius: 4,
  cursor: "pointer",
};

const pageButtonStyle = {
  padding: "6px 12px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  cursor: "pointer",
};

const thStyle = {
  textAlign: "left",
  padding: "10px 8px",
  borderBottom: "1px solid #ddd",
};

const tdStyle = {
  padding: "8px",
  verticalAlign: "top",
};

const tableThStyle = {
  padding: "10px 8px",
  textAlign: "left",
  borderBottom: "1px solid #ddd",
};

const tableTdStyle = {
  padding: "10px 8px",
  verticalAlign: "middle",
};
