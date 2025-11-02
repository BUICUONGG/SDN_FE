import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Descriptions,
  Space,
  Typography,
  message,
  Alert,
  Select,
} from "antd";
import { EyeOutlined, EditOutlined, DollarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorInModal, setErrorInModal] = useState("");

  // === Fetch orders + products ===
  const fetchOrdersAndProducts = async () => {
    setLoading(true);
    try {
      // Gọi song song 2 API
      const [orderRes, productRes] = await Promise.all([
        fetch("https://sdn302-be.onrender.com/api/orders"),
        fetch("https://sdn302-be.onrender.com/api/product"),
      ]);

      if (!orderRes.ok || !productRes.ok) {
        throw new Error("Không thể tải dữ liệu từ server");
      }

      const orderData = await orderRes.json();
      const productData = await productRes.json();

      console.log("✅ Orders API:", orderData);
      console.log("✅ Products API:", productData);

      const orderList = Array.isArray(orderData?.orders)
        ? orderData.orders
        : [];
      const productList = Array.isArray(productData?.products)
        ? productData.products
        : [];

      // Map productId -> product
      const productMap = {};
      productList.forEach((p) => {
        productMap[p._id] = p;
      });

      // Gộp dữ liệu sản phẩm vào orders
      const mergedOrders = orderList.map((order) => {
        const productId = order?.auction?.product;
        const product = productMap[productId];
        return {
          ...order,
          productInfo: product || null,
        };
      });

      setOrders(mergedOrders);
      setProducts(productList);
    } catch (err) {
      console.error("❌ Lỗi khi tải dữ liệu:", err);
      message.error(err.message || "Không thể tải dữ liệu");
      setOrders([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndProducts();
  }, []);

  // === Cập nhật trạng thái đơn hàng ===
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!orderId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://sdn302-be.onrender.com/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Cập nhật thất bại");
      }

      message.success("Cập nhật trạng thái đơn hàng thành công!");
      setEditVisible(false);
      fetchOrdersAndProducts();
    } catch (err) {
      console.error("❌ Lỗi cập nhật trạng thái:", err);
      const msg = err.message || "Không thể cập nhật trạng thái";
      setErrorInModal(msg);
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // === Modal Chi tiết ===
  const showDetail = (order) => {
    setSelectedOrder(order);
    setDetailVisible(true);
  };

  // === Modal Sửa trạng thái ===
  const showEdit = (order) => {
    setSelectedOrder(order);
    setErrorInModal("");
    setEditVisible(true);
  };

  // === Cột bảng ===
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
      width: 240,
      render: (id) => <code>{id}</code>,
    },
    {
      title: "Tên sản phẩm",
      key: "productName",
      render: (_, record) => {
        const name =
          record.productInfo?.vehicle?.[0]?.name ||
          record.productInfo?.slug ||
          "Không tìm thấy sản phẩm";
        return (
          <Tag color="blue" style={{ fontWeight: 500 }}>
            {name}
          </Tag>
        );
      },
    },
    {
      title: "Giá hiện tại",
      dataIndex: ["auction", "current_bid"],
      key: "current_bid",
      render: (price) => (
        <span>
          <DollarOutlined /> {price?.toLocaleString("vi-VN")} ₫
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = {
          pending: "orange",
          success: "green",
          failed: "red",
          cancelled: "default",
        };
        return (
          <Tag
            color={colorMap[status] || "default"}
            style={{ fontWeight: 500 }}
          >
            {status || "Chưa xác định"}
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
          >
            Chi tiết
          </Button>

          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => showEdit(record)}
            style={{ color: "#faad14" }}
          >
            Sửa trạng thái
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <Title level={2} style={{ marginBottom: 24, color: "#1a1a1a" }}>
          Quản lý đơn hàng
          <Tag color="blue" style={{ marginLeft: 12, fontWeight: 500 }}>
            Tổng: {orders.length}
          </Tag>
        </Title>

        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} đơn hàng`,
            }}
            bordered
            scroll={{ x: 1000 }}
          />
        </div>
      </div>

      {/* Modal Chi tiết */}
      <Modal
        title={<Title level={4}>Chi tiết đơn hàng</Title>}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {selectedOrder && (
          <Descriptions bordered column={1} style={{ marginTop: 16 }}>
            <Descriptions.Item label="Mã đơn hàng">
              <code>{selectedOrder._id}</code>
            </Descriptions.Item>
            <Descriptions.Item label="Tên sản phẩm">
              {selectedOrder.productInfo?.vehicle?.[0]?.name ||
                selectedOrder.productInfo?.slug ||
                "Không tìm thấy sản phẩm"}
            </Descriptions.Item>
            <Descriptions.Item label="Giá hiện tại">
              {selectedOrder?.auction?.current_bid?.toLocaleString("vi-VN")} ₫
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color="blue">{selectedOrder.status || "Chưa xác định"}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {dayjs(selectedOrder.createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật">
              {dayjs(selectedOrder.updatedAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal Sửa trạng thái */}
      <Modal
        title={<Title level={4}>Cập nhật trạng thái đơn hàng</Title>}
        open={editVisible}
        onCancel={() => {
          setEditVisible(false);
          setErrorInModal("");
        }}
        footer={null}
        width={500}
      >
        {selectedOrder && (
          <div style={{ padding: "16px 0" }}>
            {errorInModal && (
              <Alert
                message={errorInModal}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            <p style={{ marginBottom: 16, textAlign: "center" }}>
              <strong>Mã đơn hàng:</strong> <code>{selectedOrder._id}</code>
            </p>

            <div style={{ marginBottom: 24 }}>
              <span>Trạng thái đơn hàng:</span>
              <Select
                defaultValue={selectedOrder.status || "pending"}
                style={{ width: "100%", marginTop: 8 }}
                onChange={(value) =>
                  handleUpdateStatus(selectedOrder._id, value)
                }
                disabled={loading}
              >
                <Option value="pending">Pending</Option>
                <Option value="success">Success</Option>
                <Option value="failed">Failed</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
