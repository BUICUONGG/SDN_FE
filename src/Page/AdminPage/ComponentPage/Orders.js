import { useEffect, useState } from "react";
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
import { BASE_URL2 } from "../../../service/config";

const { Title } = Typography;
const { Option } = Select;

const STATUS_CONFIG = {
  pending: { color: "orange", label: "Chờ xử lý" },
  processing: { color: "blue", label: "Đang xử lý" },
  shipped: { color: "cyan", label: "Đang giao" },
  delivered: { color: "green", label: "Đã giao" },
  completed: { color: "green", label: "Hoàn thành" },
  cancelled: { color: "red", label: "Đã hủy" },
};

const getStatusTag = (status) => {
  const config = STATUS_CONFIG[status] || { color: "default", label: status || "Chưa xác định" };
  return (
    <Tag color={config.color} style={{ fontWeight: 500 }}>
      {config.label}
    </Tag>
  );
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorInModal, setErrorInModal] = useState("");
  const [newStatus, setNewStatus] = useState("");

  // === Fetch orders + products ===
  const fetchOrdersAndProducts = async () => {
    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("USER_INFO") || "{}");
      const token = userInfo.token || userInfo.accessToken;

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
        if (userInfo.userId || userInfo.user_id) {
          headers["x-client-id"] = userInfo.userId || userInfo.user_id;
        }
      }

      // Gọi song song 2 API
      const [orderRes, productRes] = await Promise.all([
        fetch(`${BASE_URL2}/orders`, { headers }),
        fetch(`${BASE_URL2}/product`, { headers }),
      ]);

      if (!orderRes.ok || !productRes.ok) {
        throw new Error("Không thể tải dữ liệu từ server");
      }

      const orderData = await orderRes.json();
      const productData = await productRes.json();

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
    setErrorInModal("");

    try {
      // Lấy token từ localStorage
      const userInfo = JSON.parse(localStorage.getItem("USER_INFO") || "{}");
      const token = userInfo.token || userInfo.accessToken;
      const clientId = userInfo.userId || userInfo.user_id;

      // Validate authentication data
      if (!token) {
        throw new Error("Vui lòng đăng nhập lại để thực hiện thao tác này");
      }

      if (!clientId) {
        throw new Error("Thiếu thông tin xác thực. Vui lòng đăng nhập lại");
      }

      // Build headers
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-client-id": clientId,
      };

      const res = await fetch(
        `${BASE_URL2}/orders/${orderId}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        }

        if (res.status === 403) {
          throw new Error(
            "Bạn không có quyền thực hiện thao tác này. Vui lòng kiểm tra:\n" +
            "1. Bạn có đang đăng nhập với tài khoản Admin?\n" +
            "2. Token có còn hợp lệ không?"
          );
        }

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Cập nhật thất bại");
        } else {
          const errorText = await res.text();
          throw new Error(errorText || `Lỗi ${res.status}: Cập nhật thất bại`);
        }
      }

      message.success("Cập nhật trạng thái đơn hàng thành công!");
      setEditVisible(false);
      await fetchOrdersAndProducts();
    } catch (err) {
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
    setNewStatus(order.status || "pending");
    setErrorInModal("");
    setEditVisible(true);
  };

  const confirmUpdate = () => {
    if (selectedOrder && newStatus) {
      handleUpdateStatus(selectedOrder._id, newStatus);
    }
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
      render: (status) => getStatusTag(status),
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
              {getStatusTag(selectedOrder.status)}
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
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setEditVisible(false);
              setErrorInModal("");
            }}
            disabled={loading}
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={confirmUpdate}
            loading={loading}
          >
            Cập nhật
          </Button>,
        ]}
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
                value={newStatus}
                style={{ width: "100%", marginTop: 8 }}
                onChange={(value) => setNewStatus(value)}
                disabled={loading}
              >
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <Option key={key} value={key}>
                    <Tag color={config.color}>{config.label}</Tag>
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
