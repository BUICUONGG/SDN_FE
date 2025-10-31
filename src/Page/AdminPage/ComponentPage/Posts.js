import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Typography,
  message,
  Switch,
  Popconfirm,
  Card,
  Row,
  Col,
  Divider,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  GlobalOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import { appService } from "../../../service/appService";

const { Title } = Typography;
const { confirm } = Modal;

export default function AdminBrandsCategories() {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [brandModal, setBrandModal] = useState({ visible: false, data: null, isEdit: false });
  const [categoryModal, setCategoryModal] = useState({ visible: false, data: null, isEdit: false });

  const [formBrand] = Form.useForm();
  const [formCategory] = Form.useForm();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  // === Xử lý lỗi backend ===
  const getErrorMessage = (error) => {
    if (!error?.response?.data) return error?.message || "Lỗi không xác định";
    const data = error.response.data;
    if (data.message) return Array.isArray(data.message) ? data.message[0] : data.message;
    if (data.error) return data.error;
    return "Lỗi máy chủ";
  };

  // === Load dữ liệu ===
  const fetchBrands = () => {
    setLoadingBrands(true);
    appService
      .getAllBrands()
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.brands || [];
        setBrands(list);
      })
      .catch((err) => {
        message.error(getErrorMessage(err));
        setBrands([]);
      })
      .finally(() => setLoadingBrands(false));
  };

  const fetchCategories = () => {
    setLoadingCategories(true);
    appService
      .getAllCategories()
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.categories || [];
        setCategories(list);
      })
      .catch((err) => {
        message.error(getErrorMessage(err));
        setCategories([]);
      })
      .finally(() => setLoadingCategories(false));
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
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
          <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
            Tìm
          </Button>
          <Button onClick={() => clearFilters && clearFilters()} size="small" style={{ width: 90 }}>
            Xóa
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
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

  // === CRUD Brands ===
  const openBrandModal = (record = null) => {
    setBrandModal({ visible: true, data: record, isEdit: !!record });
    if (record) {
      formBrand.setFieldsValue({
        name: record.name,
        country: record.country,
        is_active: record.is_active,
      });
    } else {
      formBrand.resetFields();
    }
  };

  const handleBrandSubmit = () => {
    formBrand.validateFields().then((values) => {
      const payload = { ...values };
      const request = brandModal.isEdit
        ? appService.updateBrand(brandModal.data._id, payload)
        : appService.createBrand(payload);

      request
        .then(() => {
          message.success(brandModal.isEdit ? "Cập nhật thành công!" : "Tạo mới thành công!");
          setBrandModal({ visible: false, data: null, isEdit: false });
          fetchBrands();
        })
        .catch((err) => message.error(getErrorMessage(err)));
    });
  };

  const handleDeleteBrand = (id) => {
    confirm({
      title: "Xóa thương hiệu?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        appService
          .deleteBrand(id)
          .then(() => {
            message.success("Xóa thành công!");
            fetchBrands();
          })
          .catch((err) => message.error(getErrorMessage(err)));
      },
    });
  };

  // === CRUD Categories ===
  const openCategoryModal = (record = null) => {
    setCategoryModal({ visible: true, data: record, isEdit: !!record });
    if (record) {
      formCategory.setFieldsValue({
        name: record.name,
        slug: record.slug,
        is_active: record.is_active,
      });
    } else {
      formCategory.resetFields();
    }
  };

  const handleCategorySubmit = () => {
    formCategory.validateFields().then((values) => {
      const payload = { ...values };
      const request = categoryModal.isEdit
        ? appService.updateCategory(categoryModal.data._id, payload)
        : appService.createCategory(payload);

      request
        .then(() => {
          message.success(categoryModal.isEdit ? "Cập nhật thành công!" : "Tạo mới thành công!");
          setCategoryModal({ visible: false, data: null, isEdit: false });
          fetchCategories();
        })
        .catch((err) => message.error(getErrorMessage(err)));
    });
  };

  const handleDeleteCategory = (id) => {
    confirm({
      title: "Xóa danh mục?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        appService
          .deleteCategory(id)
          .then(() => {
            message.success("Xóa thành công!");
            fetchCategories();
          })
          .catch((err) => message.error(getErrorMessage(err)));
      },
    });
  };

  // === Cột bảng ===
  const brandColumns = [
    {
      title: "Tên thương hiệu",
      dataIndex: "name",
      key: "name",
      width: 200,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Quốc gia",
      dataIndex: "country",
      key: "country",
      width: 120,
      render: (text) => <Tag icon={<GlobalOutlined />}>{text}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      width: 110,
      render: (active) => (
        <Tag color={active ? "success" : "default"}>{active ? "Hoạt động" : "Tạm khóa"}</Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Hành động",
      key: "action",
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} onClick={() => openBrandModal(record)} />
          <Popconfirm
            title="Xóa?"
            onConfirm={() => handleDeleteBrand(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const categoryColumns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      width: 250,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      width: 180,
      render: (text) => <code style={{ fontSize: 12 }}>{text}</code>,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      width: 110,
      render: (active) => (
        <Tag color={active ? "success" : "default"}>{active ? "Hoạt động" : "Tạm khóa"}</Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Hành động",
      key: "action",
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} onClick={() => openCategoryModal(record)} />
          <Popconfirm
            title="Xóa?"
            onConfirm={() => handleDeleteCategory(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <Title level={2} style={{ marginBottom: 24, color: "#1a1a1a" }}>
          Quản lý Thương hiệu & Danh mục
        </Title>

        <Row gutter={[24, 24]}>
          {/* Brands */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <TagsOutlined style={{ color: "#1890ff" }} />
                  <span>Thương hiệu</span>
                  <Tag color="blue">{brands.length}</Tag>
                </Space>
              }
              extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openBrandModal()}>
                  Thêm mới
                </Button>
              }
              bordered={false}
              style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >
              <Table
                columns={brandColumns}
                dataSource={brands}
                rowKey="_id"
                loading={loadingBrands}
                pagination={{ pageSize: 5, showSizeChanger: false }}
                scroll={{ x: 600 }}
              />
            </Card>
          </Col>

          {/* Categories */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <TagsOutlined style={{ color: "#52c41a" }} />
                  <span>Danh mục</span>
                  <Tag color="green">{categories.length}</Tag>
                </Space>
              }
              extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openCategoryModal()}>
                  Thêm mới
                </Button>
              }
              bordered={false}
              style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >
              <Table
                columns={categoryColumns}
                dataSource={categories}
                rowKey="_id"
                loading={loadingCategories}
                pagination={{ pageSize: 5, showSizeChanger: false }}
                scroll={{ x: 600 }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modal Brand */}
      <Modal
        title={brandModal.isEdit ? "Chỉnh sửa thương hiệu" : "Tạo thương hiệu mới"}
        open={brandModal.visible}
        onCancel={() => setBrandModal({ visible: false, data: null, isEdit: false })}
        onOk={handleBrandSubmit}
        okText={brandModal.isEdit ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
        width={500}
      >
        <Form form={formBrand} layout="vertical">
          <Form.Item name="name" label="Tên thương hiệu" rules={[{ required: true, message: "Vui lòng nhập tên!" }]}>
            <Input placeholder="Ví dụ: CATL" />
          </Form.Item>
          <Form.Item name="country" label="Quốc gia" rules={[{ required: true, message: "Vui lòng nhập quốc gia!" }]}>
            <Input placeholder="Ví dụ: Trung Quốc" />
          </Form.Item>
          <Form.Item name="is_active" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm khóa" defaultChecked />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Category */}
      <Modal
        title={categoryModal.isEdit ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
        open={categoryModal.visible}
        onCancel={() => setCategoryModal({ visible: false, data: null, isEdit: false })}
        onOk={handleCategorySubmit}
        okText={categoryModal.isEdit ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
        width={500}
      >
        <Form form={formCategory} layout="vertical">
          <Form.Item name="name" label="Tên danh mục" rules={[{ required: true, message: "Vui lòng nhập tên!" }]}>
            <Input placeholder="Ví dụ: Pin LFP" />
          </Form.Item>
          <Form.Item name="slug" label="Slug (URL)" rules={[{ required: true, message: "Vui lòng nhập slug!" }]}>
            <Input placeholder="Ví dụ: pin-lfp" />
          </Form.Item>
          <Form.Item name="is_active" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm khóa" defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}