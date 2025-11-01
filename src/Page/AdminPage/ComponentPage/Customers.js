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
  Switch,
  Popconfirm,
  Alert,
  Input,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  CrownOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import { appService } from "../../../service/appService";

const { Title } = Typography;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [errorInModal, setErrorInModal] = useState("");

  // === Hàm xử lý lỗi từ backend ===
  const getErrorMessage = (error) => {
    if (!error) return "Đã xảy ra lỗi không xác định.";

    const { response, message: msg } = error;

    if (response?.data) {
      const data = response.data;

      if (data.message) {
        return typeof data.message === "string" ? data.message : data.message[0];
      }
      if (data.error) {
        return typeof data.error === "string" ? data.error : JSON.stringify(data.error);
      }
      if (data.errors && typeof data.errors === "object") {
        const firstError = Object.values(data.errors)[0];
        return Array.isArray(firstError) ? firstError[0] : String(firstError);
      }
      if (typeof data === "string") return data;
    }

    return msg || "Lỗi kết nối đến máy chủ. Vui lòng thử lại.";
  };

  // === Fetch danh sách người dùng ===
  const fetchAllUsers = () => {
    setLoading(true);
    appService
      .getAllUser()
      .then((res) => {
        console.log("API Response:", res.data); // Debug

        const userList = Array.isArray(res.data)
          ? res.data
          : res.data?.users || [];

        setUsers(userList);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách:", err);
        const errorMsg = getErrorMessage(err);
        message.error(errorMsg);
        setUsers([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // === Tìm kiếm ===
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Xóa
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : "",
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  // === Xem chi tiết ===
  const showDetail = (user) => {
    setSelectedUser(user);
    setDetailVisible(true);
  };

  // === Mở modal cập nhật trạng thái ===
  const showEditStatus = (user) => {
    setSelectedUser(user);
    setErrorInModal("");
    setEditVisible(true);
  };

  // === Cập nhật trạng thái ===
  const handleUpdateStatus = (newStatus) => {
    if (!selectedUser) return;

    const payload = { status: newStatus.toString() };

    setLoading(true);
    setErrorInModal("");

    appService
      .updateUser(selectedUser._id, payload)
      .then(() => {
        message.success("Cập nhật trạng thái thành công!");
        setEditVisible(false);
        fetchAllUsers();
      })
      .catch((err) => {
        console.error("Lỗi cập nhật trạng thái:", err);
        const errorMsg = getErrorMessage(err);
        setErrorInModal(errorMsg);
        message.error(errorMsg);
      })
      .finally(() => setLoading(false));
  };

  // === Xóa người dùng ===
  const handleDelete = (id) => {
    appService
      .deleteUser(id)
      .then(() => {
        message.success("Xóa người dùng thành công!");
        fetchAllUsers();
      })
      .catch((err) => {
        console.error("Lỗi xóa người dùng:", err);
        const errorMsg = getErrorMessage(err);
        message.error(errorMsg);
      });
  };

  // === Cột bảng ===
  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "username",
      width: 220,
      ...getColumnSearchProps("username"),
      render: (text, record) => (
        <Space>
          {record.user_roles === "Admin" ? (
            <CrownOutlined style={{ color: "#f39c12" }} />
          ) : (
            <UserOutlined style={{ color: "#7f8c8d" }} />
          )}
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "user_roles",
      key: "user_roles",
      width: 110,
      filters: [
        { text: "Admin", value: "Admin" },
        { text: "Member", value: "Member" },
      ],
      onFilter: (value, record) => record.user_roles === value,
      render: (role) => (
        <Tag color={role === "Admin" ? "volcano" : "green"} style={{ fontWeight: 500 }}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status, record) => (
        <Switch
          checked={status === "true"}
          checkedChildren="Hoạt động"
          unCheckedChildren="Tạm khóa"
          onChange={(checked) => {
            handleUpdateStatus(checked);
            setUsers((prev) =>
              prev.map((u) => (u._id === record._id ? { ...u, status: checked.toString() } : u))
            );
          }}
          loading={loading && selectedUser?._id === record._id}
        />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => showDetail(record)}>
            Chi tiết
          </Button>

          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => showEditStatus(record)}
            style={{ color: "#faad14" }}
          >
            Trạng thái
          </Button>

          <Popconfirm
            title="Xóa người dùng?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <Title level={2} style={{ marginBottom: 24, color: "#1a1a1a" }}>
          Quản lý người dùng
          <Tag color="blue" style={{ marginLeft: 12, fontWeight: 500 }}>
            Tổng: {users.length}
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
            dataSource={Array.isArray(users) ? users : []}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
            }}
            bordered
            scroll={{ x: 900 }}
          />
        </div>
      </div>

      {/* Modal chi tiết */}
      <Modal
        title={<Title level={4}>Chi tiết người dùng</Title>}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={650}
      >
        {selectedUser && (
          <Descriptions bordered column={1} style={{ marginTop: 16 }}>
            <Descriptions.Item label="ID">
              <code style={{ fontSize: 12 }}>{selectedUser._id}</code>
            </Descriptions.Item>
            <Descriptions.Item label="Tên người dùng">
              <strong>{selectedUser.username}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              <Tag color={selectedUser.user_roles === "Admin" ? "volcano" : "green"}>
                {selectedUser.user_roles}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={selectedUser.status === "true" ? "success" : "default"}>
                {selectedUser.status === "true" ? "Hoạt động" : "Tạm khóa"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {dayjs(selectedUser.createdAt).format("DD/MM/YYYY HH:mm:ss")}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật lần cuối">
              {dayjs(selectedUser.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal cập nhật trạng thái */}
      <Modal
        title={<Title level={4}>Cập nhật trạng thái</Title>}
        open={editVisible}
        onCancel={() => {
          setEditVisible(false);
          setErrorInModal("");
        }}
        footer={null}
        width={500}
      >
        {selectedUser && (
          <div style={{ padding: "16px 0" }}>
            {errorInModal && (
              <Alert message={errorInModal} type="error" showIcon style={{ marginBottom: 16 }} />
            )}

            <p style={{ marginBottom: 16, fontSize: 16, textAlign: "center" }}>
              <strong>{selectedUser.username}</strong>
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <span>Trạng thái tài khoản:</span>
              <Switch
                checked={selectedUser.status === "true"}
                onChange={handleUpdateStatus}
                checkedChildren="Hoạt động"
                unCheckedChildren="Tạm khóa"
                size="large"
                loading={loading}
              />
            </div>

            <div style={{ textAlign: "right" }}>
              <Button onClick={() => setEditVisible(false)}>Hủy</Button>
              <Button
                type="primary"
                onClick={() => handleUpdateStatus(selectedUser.status === "true")}
                loading={loading}
                style={{ marginLeft: 8 }}
              >
                Lưu thay đổi
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}