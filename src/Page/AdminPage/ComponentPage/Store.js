import { useEffect, useState } from "react";
import {
  Input,
  Button,
  Modal,
  message,
  Tag,
  Space,
  Divider,
  Tooltip,
  Descriptions,
  Badge,
  Card,
  Typography,
  Row,
  Col,
  Form,
  Select,
  InputNumber,
  Switch,
  Spin,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CarOutlined,
  DollarCircleOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Battery } from "lucide-react";
import { appService } from "../../../service/appService";
import ImageUploader from "../../../Components/ImageUploader/ImageUploader";

const { Text, Title } = Typography;
const { Option } = Select;

const statusColorMap = {
  pending: "orange",
  complete: "green",
  draft: "default",
};

function formatDate(timestamp) {
  if (!timestamp) return "Chưa có";
  return new Date(timestamp).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(price) {
  if (!price) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Modal states
  const [detailModal, setDetailModal] = useState({
    open: false,
    product: null,
  });
  const [selectedImage, setSelectedImage] = useState("");
  const [formModal, setFormModal] = useState({
    open: false,
    product: null,
    mode: "add",
  });
  const [form] = Form.useForm();

  // Dữ liệu phụ
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]); // Đã sửa: setUser → setUsers
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Tải Brands & Categories
  useEffect(() => {
    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const [brandRes, catRes] = await Promise.all([
          appService.getAllBrands(),
          appService.getAllCategories(),
        ]);
        setBrands(brandRes.data.brands || []);
        setCategories(catRes.data.categories || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu phụ:", err);
        message.error("Không thể tải thương hiệu/danh mục");
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, []);

  // Tải danh sách người dùng
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await appService.getAllUser();
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Lỗi tải danh sách người dùng:", err);
        message.error("Không thể tải thông tin người dùng");
      }
    };
    loadUsers();
  }, []);

  // Tải reviews
  useEffect(() => {
    const loadReviews = async () => {
      setLoadingReviews(true);
      try {
        const res = await appService.getAllReviews(); // API: GET /api/reviews
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error("Lỗi tải đánh giá:", err);
        message.error("Không thể tải đánh giá");
      } finally {
        setLoadingReviews(false);
      }
    };
    loadReviews();
  }, []);

  // Load sản phẩm
  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize]);

  const fetchProducts = () => {
    setLoading(true);
    appService
      .getAllProduct()
      .then((res) => {
        if (res.data && res.data.products) {
          const allProducts = res.data.products;
          setProducts(allProducts);
          setTotal(res.data.total || allProducts.length);
          applyPaginationAndFilter(allProducts, searchTerm);
        } else {
          setProducts([]);
          setTotal(0);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        message.error("Không thể tải sản phẩm");
        setProducts([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  };

  const applyPaginationAndFilter = (data, search) => {
    let filtered = data;
    if (search) {
      filtered = data.filter(
        (p) =>
          p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.slug?.includes(search) ||
          p._id?.includes(search) ||
          p.battery?.[0]?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setFilteredProducts(filtered.slice(start, end));
    setTotal(filtered.length);
  };

  useEffect(() => {
    applyPaginationAndFilter(products, searchTerm);
  }, [searchTerm, currentPage, products]);

  // Xóa
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xóa sản phẩm",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        appService
          .deleteProduct(id)
          .then(() => {
            message.success("Xóa thành công");
            fetchProducts();
          })
          .catch(() => message.error("Xóa thất bại"));
      },
    });
  };

  const getProductReviews = (productId) => {
    return reviews.filter((r) => r.product === productId);
  };

  const calculateReviewStats = (productReviews) => {
    if (productReviews.length === 0) {
      return { total: 0, average: 0, distribution: [0, 0, 0, 0, 0] };
    }

    const total = productReviews.length;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    const average = (sum / total).toFixed(1);

    const distribution = [0, 0, 0, 0, 0]; // index 0: 1★, index 4: 5★
    productReviews.forEach((r) => {
      distribution[r.rating - 1]++;
    });

    return { total, average: parseFloat(average), distribution };
  };

  // Mở modal chi tiết
  const openDetail = (product) => setDetailModal({ open: true, product });

  useEffect(() => {
    if (detailModal.product) {
      const first = detailModal.product.image_url?.[0] || "/default-battery.jpg";
      setSelectedImage(first);
    }
  }, [detailModal.product]);

  // Mở modal form (add/edit)
  const openForm = (mode, product = null) => {
    setFormModal({ open: true, mode, product });

    if (mode === "edit" && product) {
      form.setFieldsValue({
        slug: product.slug,
        price: product.price,
        stock: product.stock || 0,
        image_url: Array.isArray(product.image_url) ? product.image_url : [],
        is_active: product.is_active || "pending",
        published_at: product.published_at
          ? new Date(product.published_at).toISOString().slice(0, 16)
          : null,
        creater: product.creater,
        brand: product.brand?._id || product.brand,
        category: product.category?._id || product.category,

        // Battery
        battery: {
          name: product.battery?.name || product.battery?.[0]?.name || "",
          slug: product.battery?.slug || product.battery?.[0]?.slug || "",
          capacity: product.battery?.capacity || product.battery?.[0]?.capacity || 0,
          voltage: product.battery?.voltage || product.battery?.[0]?.voltage || 0,
          healthPercentage: product.battery?.healthPercentage || product.battery?.[0]?.healthPercentage || 0,
          changeCycles: product.battery?.changeCycles || product.battery?.[0]?.changeCycles || 0,
          rangePerChange: product.battery?.rangePerChange || product.battery?.[0]?.rangePerChange || 0,
          is_active: product.battery?.is_active ?? product.battery?.[0]?.is_active ?? true,
        },

        // Vehicle
        vehicle:
          product.vehicle?.map((v) => ({
            name: v.name || "",
            slug: v.slug || "",
            year: v.year || 0,
            mileage: v.mileage || 0,
            bodyType: v.bodyType || "",
            fuelType: v.fuelType || "",
            color: v.color || "",
            is_active: v.is_active ?? true,
          })) || [],
      });
    } else {
      form.resetFields();
      // Tự động điền người tạo hiện tại
      const currentUserId =
        localStorage.getItem("USER_ID") || "69031fcd349acaa3e2b94bbe";
      form.setFieldsValue({
        creater: currentUserId,
        stock: 0,
        is_active: "pending",
        battery: {
          is_active: true,
        },
      });
    }
  };

  // Submit form
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          // name: sử dụng battery name làm product name
          slug: values.slug,
          price: values.price,
          stock: values.stock || 0,
          image_url: Array.isArray(values.image_url) 
            ? values.image_url 
            : [],
          is_active: values.is_active,
          published_at: values.published_at || new Date().toISOString(),
          creater: values.creater, // Đã có ID người dùng
          brand: values.brand,
          category: values.category,
          battery: {
            name: values.battery.name,
            slug: values.battery.slug || generateSlug(values.battery.name),
            capacity: values.battery.capacity,
            voltage: values.battery.voltage,
            healthPercentage: values.battery.healthPercentage,
            changeCycles: values.battery.changeCycles,
            rangePerChange: values.battery.rangePerChange,
            is_active: values.battery.is_active,
          },
          vehicle:
            values.vehicle?.map((v) => ({
              name: v.name,
              slug: v.slug || generateSlug(v.name),
              year: v.year,
              mileage: v.mileage,
              bodyType: v.bodyType,
              fuelType: v.fuelType,
              color: v.color,
              is_active: v.is_active,
            })) || [],
        };

        const apiCall =
          formModal.mode === "add"
            ? appService.createProduct(payload)
            : appService.updateProduct(formModal.product._id, payload);

        apiCall
          .then(() => {
            message.success(
              formModal.mode === "add"
                ? "Thêm thành công!"
                : "Cập nhật thành công!"
            );
            setFormModal({ open: false });
            form.resetFields();
            fetchProducts();
          })
          .catch((err) => {
            console.error("Lỗi API:", err);
            message.error("Lưu thất bại. Vui lòng thử lại.");
          });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const maxPage = Math.ceil(total / pageSize);

  // Hàm dò tên
  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b._id === brandId);
    return brand ? brand.name : "Không xác định";
  };

  const getCategoryName = (catId) => {
    const cat = categories.find((c) => c._id === catId);
    return cat ? cat.name : "Không xác định";
  };

  const getCreatorName = (creatorId) => {
    console.log(creatorId);
    const user = users.find((u) => u._id === creatorId);
    return user?.user_profile?.name || user?.username || "Không xác định";
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < rating ? "#faad14" : "#d9d9d9" }}>
        ★
      </span>
    ));
  };
  console.log(products);

  return (
    <div style={{ padding: "30px", background: "#f7f7f7", minHeight: "90vh" }}>
      {/* Header */}
      <Card style={{ marginBottom: 20 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: 300 }}
            />
          </Col>
          <Col>
            <Button icon={<FilterOutlined />}>Lọc</Button>
          </Col>
          <Col flex="auto" style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openForm("add")}
            >
              Thêm Sản Phẩm
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Danh sách */}
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {loading ? (
          <Card>
            <Spin tip="Đang tải..." />
          </Card>
        ) : filteredProducts.length === 0 ? (
          <Card>
            <div style={{ textAlign: "center", padding: 40 }}>
              <Text type="secondary">Chưa có sản phẩm</Text>
              <br />
              <Button type="primary" onClick={() => openForm("add")}>
                Thêm sản phẩm đầu tiên
              </Button>
            </div>
          </Card>
        ) : (
          filteredProducts.map((product) => {
            const statusColor = statusColorMap[product.is_active] || "default";

            return (
              <Card
                key={product._id}
                style={{
                  borderLeft: `4px solid ${
                    statusColorMap[statusColor] || "#d9d9d9"
                  }`,
                }}
              >
                <Row gutter={16} align="middle">
                  <Col flex="1">
                    <Space direction="vertical" size={4}>
                      <Space align="center">
                        <Title level={5} style={{ margin: 0 }}>
                          {product.battery.name || "Chưa đặt tên"}
                        </Title>
                        <Tag color={statusColor}>
                          {String(product.is_active || "unknown").toUpperCase()}
                        </Tag>
                      </Space>

                      {product.battery && (
                        <Space
                          size="small"
                          style={{ fontSize: 12, color: "#666" }}
                        >
                          <Battery style={{ color: "#52c41a" }} />
                          <Text strong>{product.battery.capacity} kWh</Text>
                          <Text type="secondary">
                            • SOH: {product.battery.healthPercentage}%
                          </Text>
                          <Text>• {product.battery.rangePerChange} km</Text>
                        </Space>
                      )}

                      <Space size="large" style={{ fontSize: 13 }}>
                        <Space>
                          <DollarCircleOutlined />{" "}
                          {formatCurrency(product.price)}
                        </Space>
                        <Space>
                          <CalendarOutlined /> {formatDate(product.createdAt)}
                        </Space>
                        <Space>
                          <CarOutlined /> {product.vehicle?.length || 0} xe
                        </Space>
                        <Space>
                          <UserOutlined /> {getCreatorName(product.creater)}
                        </Space>
                      </Space>

                      <Space
                        size="small"
                        style={{ fontSize: 12, color: "#888" }}
                      >
                        <Text type="secondary">
                          Thương hiệu:{" "}
                          <strong>{getBrandName(product.brand)}</strong>
                        </Text>
                        <Text type="secondary">
                          Danh mục:{" "}
                          <strong>{getCategoryName(product.category)}</strong>
                        </Text>
                      </Space>
                    </Space>
                  </Col>

                  <Col>
                    <Space>
                      <Tooltip title="Xem chi tiết">
                        <Button
                          icon={<EyeOutlined />}
                          onClick={() => openDetail(product)}
                        />
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <Button
                          type="primary"
                          icon={<EditOutlined />}
                          onClick={() => openForm("edit", product)}
                        />
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(product._id)}
                        />
                      </Tooltip>
                    </Space>
                  </Col>
                </Row>
              </Card>
            );
          })
        )}
      </Space>

      {/* Phân trang */}
      {total > pageSize && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "#fff",
            padding: "12px 16px",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            zIndex: 100,
          }}
        >
          <Button
            size="small"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Trước
          </Button>
          <Text strong>
            {currentPage} / {maxPage}
          </Text>
          <Button
            size="small"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, maxPage))}
            disabled={currentPage === maxPage}
          >
            Sau
          </Button>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Tổng: {total}
          </Text>
        </div>
      )}

      {/* Modal Chi tiết */}
      <Modal
        title={
          <Space>
            <EyeOutlined /> Chi tiết sản phẩm
          </Space>
        }
        open={detailModal.open}
        onCancel={() => setDetailModal({ open: false })}
        footer={null}
        width={900}
      >
        {detailModal.product && (
          <>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}>
                  <img
                    src={selectedImage || detailModal.product.image_url?.[0] || "/default-battery.jpg"}
                    alt="Product"
                    style={{ width: "100%", height: 300, objectFit: "cover", display: "block" }}
                  />
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8, overflowX: "auto" }}>
                  {(detailModal.product.image_url || []).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`thumb-${idx}`}
                      onClick={() => setSelectedImage(img)}
                      style={{
                        width: 76,
                        height: 76,
                        objectFit: "cover",
                        borderRadius: 8,
                        cursor: "pointer",
                        border: selectedImage === img ? "3px solid #28a745" : "2px solid #e9ecef",
                      }}
                    />
                  ))}
                </div>
              </Col>
              <Col span={16}>
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="Tên" span={2}>
                    <strong>{detailModal.product.battery?.[0]?.name || detailModal.product.battery?.name}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Slug">
                    <code>{detailModal.product.slug}</code>
                  </Descriptions.Item>
                  <Descriptions.Item label="Giá">
                    <Text type="success">{formatCurrency(detailModal.product.price)}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Badge
                      status={
                        statusColorMap[detailModal.product.is_active] === "green" ? "success" : "default"
                      }
                      text={String(detailModal.product.is_active).toUpperCase()}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tạo">
                    {formatDate(detailModal.product.createdAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Xuất bản">
                    {formatDate(detailModal.product.published_at)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cập nhật">
                    {formatDate(detailModal.product.updatedAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Người tạo">
                    <UserOutlined /> {getCreatorName(detailModal.product.creater)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tồn kho">
                    <Text 
                      strong 
                      style={{ 
                        color: (detailModal.product.stock || 0) < 5 ? '#ff4d4f' : '#52c41a',
                        fontSize: 16
                      }}
                    >
                      {detailModal.product.stock || 0} sản phẩm
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <Space style={{ marginBottom: 16 }}>
              <Text strong>Thương hiệu:</Text>{" "}
              {getBrandName(detailModal.product.brand)}
              <Text strong style={{ marginLeft: 24 }}>
                Danh mục:
              </Text>{" "}
              {getCategoryName(detailModal.product.category)}
            </Space>

            {(() => {
              const battery = Array.isArray(detailModal.product.battery) 
                ? detailModal.product.battery[0] 
                : detailModal.product.battery;
              
              if (!battery) return null;

              return (
                <>
                  <Title level={5}>
                    <Battery style={{ marginRight: 8 }} /> Thông tin Pin
                  </Title>
                  <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="Tên pin">
                      {battery.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Slug pin">
                      {battery.slug}
                    </Descriptions.Item>
                    <Descriptions.Item label="Dung lượng">
                      {battery.capacity} kWh
                    </Descriptions.Item>
                    <Descriptions.Item label="SOH">
                      {battery.healthPercentage}%
                    </Descriptions.Item>
                    <Descriptions.Item label="Quãng đường">
                      {battery.rangePerChange} km
                    </Descriptions.Item>
                    <Descriptions.Item label="Chu kỳ">
                      {battery.changeCycles}
                    </Descriptions.Item>
                    <Descriptions.Item label="Điện áp">
                      {battery.voltage}V
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                      <Badge
                        status={battery.is_active ? "success" : "error"}
                        text={battery.is_active ? "Hoạt động" : "Không hoạt động"}
                      />
                    </Descriptions.Item>
                  </Descriptions>
                </>
              );
            })()}

            <Divider>Đánh giá sản phẩm</Divider>

            {loadingReviews ? (
              <Spin tip="Đang tải đánh giá..." />
            ) : (
              <>
                {(() => {
                  const productReviews = getProductReviews(
                    detailModal.product._id
                  );
                  const stats = calculateReviewStats(productReviews);

                  return (
                    <>
                      {/* Thống kê tổng quan */}
                      <Card size="small" style={{ marginBottom: 16 }}>
                        <Row gutter={16} align="middle">
                          <Col>
                            <Title level={3} style={{ margin: 0 }}>
                              {stats.average > 0 ? stats.average : "Chưa có"}
                            </Title>
                            <Text type="secondary">trên 5</Text>
                          </Col>
                          <Col>
                            {renderStars(Math.round(stats.average))}
                            <div style={{ marginTop: 4 }}>
                              <Text strong>{stats.total}</Text> đánh giá
                            </div>
                          </Col>
                          <Col flex="auto">
                            <Space
                              direction="vertical"
                              size={4}
                              style={{ width: "100%" }}
                            >
                              {[5, 4, 3, 2, 1].map((star) => (
                                <Row key={star} align="middle" gutter={8}>
                                  <Col span={3}>{star}★</Col>
                                  <Col span={16}>
                                    <div
                                      style={{
                                        height: 8,
                                        background: "#f5f5f5",
                                        borderRadius: 4,
                                        overflow: "hidden",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: `${
                                            (stats.distribution[star - 1] /
                                              stats.total) *
                                              100 || 0
                                          }%`,
                                          height: "100%",
                                          background: "#faad14",
                                        }}
                                      />
                                    </div>
                                  </Col>
                                  <Col span={5} style={{ textAlign: "right" }}>
                                    <Text type="secondary">
                                      {stats.distribution[star - 1]}
                                    </Text>
                                  </Col>
                                </Row>
                              ))}
                            </Space>
                          </Col>
                        </Row>
                      </Card>

                      {/* Danh sách đánh giá */}
                      <Space direction="vertical" style={{ width: "100%" }}>
                        {productReviews.length === 0 ? (
                          <Text type="secondary">Chưa có đánh giá nào.</Text>
                        ) : (
                          productReviews.map((review) => {
                            const reviewer = users.find(
                              (u) => u._id === review.reviewer
                            );
                            return (
                              <Card
                                key={review._id}
                                size="small"
                                style={{ marginBottom: 8 }}
                              >
                                <Space
                                  direction="vertical"
                                  size={4}
                                  style={{ width: "100%" }}
                                >
                                  <Space>
                                    {renderStars(review.rating)}
                                    <Text strong>
                                      {reviewer?.username || "Khách"}
                                    </Text>
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: 12 }}
                                    >
                                      {formatDate(review.createdAt)}
                                    </Text>
                                  </Space>
                                  <Text>{review.content}</Text>
                                </Space>
                              </Card>
                            );
                          })
                        )}
                      </Space>
                    </>
                  );
                })()}
              </>
            )}
          </>
        )}
      </Modal>

      {/* Modal Form Thêm/Sửa */}
      <Modal
        title={
          formModal.mode === "add" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"
        }
        open={formModal.open}
        onCancel={() => {
          setFormModal({ open: false });
          form.resetFields();
        }}
        onOk={handleSubmit}
        okText={formModal.mode === "add" ? "Thêm" : "Lưu"}
        cancelText="Hủy"
        width={1200}
        destroyOnClose
      >
        <Spin spinning={loadingOptions}>
          <Form form={form} layout="vertical" preserve={false}>
            {/* Ẩn creater - chỉ backend xử lý */}
            <Form.Item name="creater" style={{ display: "none" }}>
              <Input />
            </Form.Item>

            {/* Slug - tên sản phẩm sẽ lấy từ battery.name */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="slug"
                  label="Slug"
                  rules={[{ required: true, message: "Vui lòng nhập slug" }]}
                >
                  <Input 
                    placeholder="VD: pin-tesla-m3-75kwh"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Image Upload */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="image_url"
                  label="Hình ảnh sản phẩm"
                  tooltip="Upload tối đa 5 ảnh, mỗi ảnh < 5MB"
                  rules={[
                    { 
                      required: true, 
                      message: "Vui lòng upload ít nhất 1 ảnh" 
                    }
                  ]}
                >
                  <ImageUploader
                    maxCount={5}
                    folder="ev-products"
                    tags={['battery', 'product']}
                    onChange={(urls) => {
                      form.setFieldsValue({ image_url: urls });
                    }}
                    defaultImageUrls={form.getFieldValue('image_url') || []}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Giá & Trạng thái */}
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  name="price"
                  label="Giá (VND)"
                  rules={[{ required: true, type: "number" }]}
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="stock"
                  label="Tồn kho"
                  rules={[{ required: true, type: "number" }]}
                  tooltip="Cảnh báo nếu < 5"
                >
                  <InputNumber 
                    style={{ width: "100%" }} 
                    min={0}
                    status={(form.getFieldValue('stock') || 0) < 5 ? 'warning' : ''}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="is_active"
                  label="Trạng thái"
                  rules={[{ required: true }]}
                  initialValue="pending"
                >
                  <Select>
                    <Option value="pending">Chờ duyệt</Option>
                    <Option value="complete">Hoàn thành</Option>
                    <Option value="draft">Nháp</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="published_at" label="Ngày xuất bản">
                  <Input type="datetime-local" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            {/* Phân loại */}
            <Divider>Phân loại</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="brand"
                  label="Thương hiệu"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Chọn thương hiệu"
                    loading={loadingOptions}
                  >
                    {brands.map((b) => (
                      <Option key={b._id} value={b._id}>
                        {b.name} ({b.country})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="Danh mục"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Chọn danh mục" loading={loadingOptions}>
                    {categories.map((c) => (
                      <Option key={c._id} value={c._id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Pin */}
            <Divider>Thông tin Pin</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name={["battery", "name"]} label="Tên pin">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={["battery", "slug"]} label="Slug pin">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={["battery", "capacity"]}
                  label="Dung lượng (kWh)"
                >
                  <InputNumber style={{ width: "100%" }} min={0} step={0.1} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={["battery", "voltage"]} label="Điện áp (V)">
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={["battery", "healthPercentage"]}
                  label="SOH (%)"
                >
                  <InputNumber style={{ width: "100%" }} min={0} max={100} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={["battery", "changeCycles"]}
                  label="Chu kỳ sạc"
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={["battery", "rangePerChange"]}
                  label="Quãng đường (km)"
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={["battery", "is_active"]}
                  label="Pin hoạt động"
                  valuePropName="checked"
                >
                  <Switch defaultChecked />
                </Form.Item>
              </Col>
            </Row>

            {/* Xe - Form.List */}
            <Divider>Xe tương thích</Divider>
            <Form.List name="vehicle">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card
                      key={key}
                      size="small"
                      style={{ marginBottom: 16 }}
                      extra={
                        <Button
                          danger
                          size="small"
                          onClick={() => remove(name)}
                          icon={<DeleteOutlined />}
                        />
                      }
                    >
                      <Row gutter={16}>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, "name"]}
                            label="Tên xe"
                            rules={[{ required: true }]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, "slug"]}
                            label="Slug xe"
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "year"]}
                            label="Năm"
                          >
                            <InputNumber style={{ width: "100%" }} min={1900} />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "mileage"]}
                            label="KM"
                          >
                            <InputNumber style={{ width: "100%" }} min={0} />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "bodyType"]}
                            label="Kiểu dáng"
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "fuelType"]}
                            label="Nhiên liệu"
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "color"]}
                            label="Màu"
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "is_active"]}
                            label="Hoạt động"
                            valuePropName="checked"
                          >
                            <Switch />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm xe
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
}
