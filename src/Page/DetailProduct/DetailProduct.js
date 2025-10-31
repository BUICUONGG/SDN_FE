import React, { useEffect, useState } from "react";
import "./DetailProduct.css";
import { useNavigate, useParams } from "react-router-dom";
import OrtherProductShop from "./OrtherProductShop";
import ProductLike from "./ProductLike";
import { RiArrowDropLeftFill } from "react-icons/ri";
import { appService } from "../../service/appService";
import { useCart } from "../CartPage/CartContext";
import { notification } from "antd";
import FancyLoadingPage from "../../Components/Spinner/FancyLoadingPage";
import {
  IoLocationOutline,
  IoBatteryCharging,
  IoSpeedometerOutline,
  IoRepeatOutline,
  IoShieldCheckmarkOutline,
  IoCarSportOutline,
  IoCalendarOutline,
  IoColorPalette,
  IoConstructOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { CiClock2 } from "react-icons/ci";
import { localUserService } from "../../service/localService";

// === HÀM LẤY USER ID TỪ TOKEN ===
const getUserIdFromToken = () => {
  const token = localUserService.getAccessToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id || payload._id || null; // Dựa trên token của bạn: "user_id"
  } catch {
    return null;
  }
};

export default function DetailProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [dataShop, setDataShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [productReviews, setProductReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null); // Review đang sửa
  const { addToCart } = useCart();

  const [startIndex, setStartIndex] = useState(0);
  const maxThumbnails = 6;
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  // === KIỂM TRA ĐĂNG NHẬP ===
  const token = localUserService.getAccessToken();
  const userId = getUserIdFromToken();
  console.log("Token:", token ? "Có" : "Không", "User ID:", userId);

  const openNotification = (type, message, description) => {
    api[type]({ message, description });
  };

  const handleAddToCart = () => {
    const cartProduct = {
      id: product._id,
      name: product.productName || `Pin ${product.battery[0]?.name}`,
      price: product.price,
      image: product.image_url?.[0] || "/default-battery.jpg",
      quantity: 1,
      variantId: product._id,
      shopId: product.creater,
    };
    addToCart(cartProduct);
    openNotification("success", "Thành công", "Đã thêm vào giỏ hàng!");
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleBuyNow = () => {
    const cartProduct = {
      id: product._id,
      name: product.productName || `Pin ${product.battery[0]?.name}`,
      price: product.price,
      image: product.image_url?.[0] || "/default-battery.jpg",
      quantity: 1,
      variantId: product._id,
      shopId: product.creater,
    };
    localStorage.setItem("checkoutProduct", JSON.stringify([cartProduct]));
    navigate("/payment-now");
  };

  // === LẤY SẢN PHẨM ===
  useEffect(() => {
    appService
      .getDetailProduct(id)
      .then((res) => {
        const data = res.data.product || {};
        // Normalize image_url so downstream code can assume an array
        const images = Array.isArray(data.image_url)
          ? data.image_url
          : data.image_url
          ? [data.image_url]
          : [];
        const normalized = { ...data, image_url: images };
        setProduct(normalized);
        // set selected image to first image or a fallback placeholder
        setSelectedImage(images[0] || "/default-battery.jpg");
      })
      .catch((err) => console.error("Lỗi lấy sản phẩm:", err))
      .finally(() => setTimeout(() => setLoading(false), 800));
  }, [id]);

  // === LẤY TẤT CẢ REVIEWS ===
  const fetchReviews = () => {
    appService
      .getAllReviews()
      .then((res) => setReviews(res.data.reviews || []))
      .catch((err) => console.error("Lỗi lấy reviews:", err));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // === LỌC REVIEWS THEO SẢN PHẨM ===
  useEffect(() => {
    if (product && reviews.length > 0) {
      const filtered = reviews.filter((r) => r.product === product._id);
      setProductReviews(filtered);
    }
  }, [product, reviews]);

  // === LẤY THÔNG TIN SHOP ===
  useEffect(() => {
    if (product?.creater) {
      appService
        .getDetailStoreCus(product.creater)
        .then((res) => setDataShop(res.data.metadata))
        .catch((err) => console.error("Error fetching store:", err));
    }
  }, [product]);

  // === XỬ LÝ SỬA REVIEW ===
  const handleEditReview = (review) => {
    setEditingReview(review);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleUpdateReview = async (reviewId, updatedData) => {
    try {
      await appService.updateReview(reviewId, updatedData);
      openNotification("success", "Thành công", "Đã cập nhật đánh giá!");
      setEditingReview(null);
      fetchReviews();
    } catch (err) {
      openNotification("error", "Lỗi", "Không thể cập nhật đánh giá.");
    }
  };

  // === XỬ LÝ XÓA REVIEW ===
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;

    try {
      await appService.deleteReview(reviewId);
      openNotification("success", "Thành công", "Đã xóa đánh giá!");
      fetchReviews();
    } catch (err) {
      openNotification("error", "Lỗi", "Không thể xóa đánh giá.");
    }
  };

  if (loading) return <FancyLoadingPage />;
  if (!product) return <p style={{ padding: 50, textAlign: "center" }}>Không tìm thấy sản phẩm.</p>;

  const battery = product.battery?.[0] || {};
  const vehicle = product.vehicle?.[0] || {};
  const isOutOfStock = !battery.is_active;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

  // === TÍNH TRUNG BÌNH SAO ===
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const countRatings = (reviews, star) => reviews.filter((r) => r.rating === star).length;

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < full ? "#f39c12" : "#ddd", fontSize: "20px" }}>
        {i < full ? "★" : i === full && hasHalf ? "★" : "☆"}
      </span>
    ));
  };

  return (
    <div style={{ padding: "2% 5%", backgroundColor: "#f8f9fa", fontFamily: "'Inter', sans-serif" }}>
      {contextHolder}

      {/* Breadcrumb */}
      <div
        style={{
          marginBottom: "20px",
          background: "#fff",
          padding: "12px 16px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ color: "#6c757d" }}>Pin xe điện</span>
        <RiArrowDropLeftFill style={{ color: "#adb5bd" }} />
        <span style={{ fontWeight: "600", color: "#212529" }}>
          {battery.name || "Pin không xác định"}
        </span>
      </div>

      {/* Main Product Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", gap: "3%", padding: "3%" }}>
          {/* Images */}
          <div style={{ flex: "0 0 48%" }}>
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "16px",
                overflowX: "auto",
                paddingBottom: "8px",
              }}
            >
              {(product.image_url || []).slice(startIndex, startIndex + maxThumbnails).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: "76px",
                    height: "76px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border: selectedImage === img ? "3px solid #28a745" : "2px solid #e9ecef",
                    transition: "all 0.2s",
                  }}
                />
              ))}
            </div>
            <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 6px 16px rgba(0,0,0,0.1)" }}>
              <img src={selectedImage} alt="Main" style={{ width: "100%", display: "block" }} />
            </div>
          </div>

          {/* Product Info */}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "26px", fontWeight: "700", margin: "0 0 12px", color: "#1a1a1a" }}>
              {battery.name}
            </h1>

            {vehicle.name && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#e3f2fd",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#1976d2",
                  marginBottom: "16px",
                  width: "fit-content",
                }}
              >
                <IoCarSportOutline />
                <strong>{vehicle.name}</strong> ({vehicle.year})
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  background:
                    battery.healthPercentage >= 80
                      ? "#d4edda"
                      : battery.healthPercentage >= 70
                      ? "#fff3cd"
                      : "#f8d7da",
                  color:
                    battery.healthPercentage >= 80
                      ? "#155724"
                      : battery.healthPercentage >= 70
                      ? "#856404"
                      : "#721c24",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "15px",
                }}
              >
                SOH: {battery.healthPercentage}%
              </div>
              <span style={{ fontSize: "14px", color: "#555" }}>
                {battery.healthPercentage >= 80
                  ? "Xuất sắc"
                  : battery.healthPercentage >= 70
                  ? "Tốt"
                  : "Cần kiểm tra"}
              </span>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "32px", fontWeight: "700", color: "#d32f2f", margin: "0" }}>
                {product.price?.toLocaleString()} ₫
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px 20px",
                marginBottom: "24px",
                fontSize: "14.5px",
              }}
            >
              <SpecItem icon={<IoBatteryCharging />} label="Dung lượng" value={`${battery.capacity} kWh`} />
              <SpecItem icon={<IoSpeedometerOutline />} label="Tầm vận hành" value={`${battery.rangePerChange} km`} />
              <SpecItem icon={<IoRepeatOutline />} label="Chu kỳ sạc" value={`${battery.changeCycles} lần`} />
              <SpecItem icon={<IoConstructOutline />} label="Điện áp" value={`${battery.voltage} V`} />
              {vehicle.mileage && (
                <SpecItem icon={<IoSpeedometerOutline />} label="Km đã đi" value={`${vehicle.mileage.toLocaleString()} km`} />
              )}
              {vehicle.color && (
                <SpecItem icon={<IoColorPalette />} label="Màu xe" value={vehicle.color} />
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "15px", fontWeight: "600", color: battery.is_active ? "#2e7d32" : "#c62828" }}>
                {battery.is_active ? "Còn hàng" : "Hết hàng"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
              <button
                onClick={handleAddToCart}
                disabled={!battery.is_active}
                style={{
                  flex: 1,
                  padding: "14px",
                  fontSize: "15px",
                  fontWeight: "600",
                  border: "2px solid #28a745",
                  background: !battery.is_active ? "#f5f5f5" : "#fff",
                  color: !battery.is_active ? "#999" : "#28a745",
                  borderRadius: "10px",
                  cursor: !battery.is_active ? "not-allowed" : "pointer",
                }}
              >
                THÊM VÀO GIỎ
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!battery.is_active}
                style={{
                  flex: 1,
                  padding: "14px",
                  fontSize: "15px",
                  fontWeight: "600",
                  background: !battery.is_active ? "#ccc" : "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: !battery.is_active ? "not-allowed" : "pointer",
                }}
              >
                MUA NGAY
              </button>
            </div>

            <div style={{ fontSize: "13px", color: "#6c757d", lineHeight: "1.6" }}>
              <p><IoLocationOutline /> Phường Nhật Tân, Quận Tây Hồ, Hà Nội</p>
              <p><CiClock2 /> Đăng ngày {formatDate(product.published_at || product.createdAt)}</p>
              <p><IoCalendarOutline /> Cập nhật {formatDate(product.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Shop Info */}
        {dataShop && (
          <div style={{ borderTop: "1px solid #e9ecef", padding: "3%", display: "flex", alignItems: "center", gap: "3%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
              <img
                src={dataShop.avatarUrl || "https://via.placeholder.com/70"}
                alt="Shop"
                style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <p style={{ fontWeight: "600", margin: "0", fontSize: "16px" }}>{dataShop.shopName}</p>
                <p style={{ fontSize: "13px", color: "#6c757d", margin: "4px 0" }}>
                  {dataShop.online ? "Đang hoạt động" : "Ngoại tuyến"}
                </p>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button style={{ padding: "6px 14px", fontSize: "13px", border: "1px solid #dee2e6", borderRadius: "6px", background: "#fff" }}>
                    Chat ngay
                  </button>
                  <button style={{ padding: "6px 14px", fontSize: "13px", border: "1px solid #dee2e6", borderRadius: "6px", background: "#fff" }}>
                    Xem shop
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "14px", color: "#495057" }}>
              <div><strong>Đánh giá</strong>: <span style={{ color: "#28a745", fontWeight: "600" }}>{dataShop.rating || 0}</span></div>
              <div><strong>Sản phẩm</strong>: <span style={{ color: "#28a745", fontWeight: "600" }}>{dataShop.productsCount || 0}</span></div>
              <div><strong>Phản hồi</strong>: <span style={{ color: "#28a745", fontWeight: "600" }}>{dataShop.responseRate || 0}%</span></div>
              <div><strong>Theo dõi</strong>: <span style={{ color: "#28a745", fontWeight: "600" }}>{dataShop.followers || 0}</span></div>
            </div>
          </div>
        )}
      </div>

      {/* === ĐÁNH GIÁ SẢN PHẨM === */}
      <div
        style={{
          marginTop: "40px",
          background: "#fff",
          borderRadius: "16px",
          padding: "3%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "700", margin: "0 0 24px", color: "#1a1a1a" }}>
          ĐÁNH GIÁ SẢN PHẨM ({productReviews.length})
        </h2>

        {productReviews.length > 0 ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "32px", marginBottom: "32px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "48px", fontWeight: "700", color: "#f39c12" }}>
                  {calculateAverageRating(productReviews)}/5
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginTop: "8px" }}>
                  {renderStars(calculateAverageRating(productReviews))}
                </div>
                <p style={{ margin: "8px 0 0", color: "#666", fontSize: "14px" }}>
                  Dựa trên {productReviews.length} đánh giá
                </p>
              </div>

              <div style={{ flex: 1 }}>
                {[5, 4, 3, 2, 1].map((star) => (
                  <RatingBar
                    key={star}
                    star={star}
                    count={countRatings(productReviews, star)}
                    total={productReviews.length}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gap: "20px" }}>
              {productReviews.map((review) => (
                <ReviewItem
                  key={review._id}
                  review={review}
                  userId={userId}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#999" }}>
            <p style={{ fontSize: "16px" }}>Chưa có đánh giá nào</p>
            <p style={{ fontSize: "14px" }}>Hãy là người đầu tiên đánh giá sản phẩm này!</p>
          </div>
        )}

        {/* === FORM VIẾT ĐÁNH GIÁ MỚI === */}
        <div style={{ marginTop: "32px" }}>
          {token ? (
            <ReviewForm productId={product._id} userId={userId} onReviewSubmitted={fetchReviews} />
          ) : (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#666", marginBottom: "16px" }}>
                Bạn cần đăng nhập để viết đánh giá
              </p>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "12px 32px",
                  fontSize: "15px",
                  fontWeight: "600",
                  background: "#fff",
                  color: "#28a745",
                  border: "2px solid #28a745",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                Đăng nhập ngay
              </button>
            </div>
          )}
        </div>
      </div>

      {/* === MODAL SỬA REVIEW === */}
      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onUpdate={handleUpdateReview}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Detailed Specs */}
      <div
        style={{
          marginTop: "32px",
          background: "#fff",
          borderRadius: "16px",
          padding: "3%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "700", margin: "0 0 20px", color: "#1a1a1a" }}>
          THÔNG SỐ CHI TIẾT
        </h2>

        <div style={{ display: "grid", gap: "16px", fontSize: "15px" }}>
          <Section title="Thông tin Pin">
            <SpecRow label="Tên lô pin" value={battery.name} />
            <SpecRow label="Mã lô (slug)" value={battery.slug} />
            <SpecRow label="Dung lượng" value={`${battery.capacity} kWh`} />
            <SpecRow label="Điện áp" value={`${battery.voltage} V`} />
            <SpecRow label="Sức khỏe (SOH)" value={`${battery.healthPercentage}%`} highlight />
            <SpecRow label="Chu kỳ sạc" value={battery.changeCycles} />
            <SpecRow label="Tầm vận hành" value={`${battery.rangePerChange} km/lần sạc`} />
            <SpecRow label="Trạng thái" value={battery.is_active ? "Hoạt động" : "Ngừng"} />
          </Section>

          {vehicle.name && (
            <Section title="Thông tin xe gốc">
              <SpecRow label="Tên xe" value={vehicle.name} />
              <SpecRow label="Năm sản xuất" value={vehicle.year} />
              <SpecRow label="Km đã đi" value={`${vehicle.mileage?.toLocaleString()} km`} />
              <SpecRow label="Loại xe" value={vehicle.bodyType} />
              <SpecRow label="Nhiên liệu" value={vehicle.fuelType} />
              <SpecRow label="Màu sắc" value={vehicle.color} />
            </Section>
          )}

          <Section title="Thông tin sản phẩm">
            <SpecRow label="Mã sản phẩm" value={product._id} />
            <SpecRow label="Ngày đăng" value={formatDate(product.published_at || product.createdAt)} />
            <SpecRow label="Cập nhật lần cuối" value={formatDate(product.updatedAt)} />
            <SpecRow label="Trạng thái" value={product.is_active === "complete" ? "Hoàn tất" : product.is_active} />
          </Section>
        </div>
      </div>

      <div style={{ marginTop: "32px" }}>
        <OrtherProductShop />
      </div>
      <div style={{ marginTop: "32px" }}>
        <ProductLike />
      </div>
    </div>
  );
}

// === HELPER COMPONENTS (giữ nguyên) ===
const SpecItem = ({ icon, label, value }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <div style={{ color: "#28a745", fontSize: "22px" }}>{icon}</div>
    <div>
      <div style={{ fontSize: "13px", color: "#6c757d" }}>{label}</div>
      <div style={{ fontWeight: "600", color: "#212529" }}>{value}</div>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div style={{ border: "1px solid #e9ecef", borderRadius: "12px", overflow: "hidden" }}>
    <div style={{ background: "#f8f9fa", padding: "12px 16px", fontWeight: "600", fontSize: "15px" }}>
      {title}
    </div>
    <div style={{ padding: "16px" }}>{children}</div>
  </div>
);

const SpecRow = ({ label, value, highlight }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: "1px dashed #e9ecef",
      fontSize: "14.5px",
    }}
  >
    <span style={{ color: "#495057" }}>{label}:</span>
    <span style={{ fontWeight: highlight ? "700" : "600", color: highlight ? "#d32f2f" : "#212529" }}>
      {value}
    </span>
  </div>
);

const RatingBar = ({ star, count, total }) => {
  const percent = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
      <span style={{ width: "20px", fontSize: "14px" }}>{star} ★</span>
      <div style={{ flex: 1, height: "8px", background: "#eee", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ width: `${percent}%`, height: "100%", background: "#f39c12", borderRadius: "4px" }} />
      </div>
      <span style={{ width: "40px", textAlign: "right", fontSize: "13px", color: "#666" }}>{count}</span>
    </div>
  );
};

// === REVIEW ITEM (THÊM NÚT SỬA/XÓA) ===
const ReviewItem = ({ review, userId, onEdit, onDelete }) => {
  const isOwner = review.reviewer === userId;
  const formatDate = (d) => new Date(d).toLocaleDateString("vi-VN");
  const reviewerName = review.reviewer === "67b1c2d3e4f5a67890123601" ? "Khách A" : "Khách B";

  return (
    <div style={{ border: "1px solid #e9ecef", borderRadius: "12px", padding: "16px", background: "#fdfdfd" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              color: "#fff",
              fontSize: "14px",
            }}
          >
            {reviewerName[0]}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: "600", fontSize: "15px" }}>{reviewerName}</p>
            <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#666" }}>{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "2px" }}>
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ color: i < review.rating ? "#f39c12" : "#ddd", fontSize: "18px" }}>
                ★
              </span>
            ))}
          </div>
          {isOwner && (
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                onClick={() => onEdit(review)}
                style={{
                  padding: "4px 8px",
                  fontSize: "12px",
                  background: "#ffc107",
                  color: "#000",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                title="Sửa"
              >
                <IoPencilOutline />
              </button>
              <button
                onClick={() => onDelete(review._id)}
                style={{
                  padding: "4px 8px",
                  fontSize: "12px",
                  background: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                title="Xóa"
              >
                <IoTrashOutline />
              </button>
            </div>
          )}
        </div>
      </div>
      <p style={{ margin: "12px 0 0", fontSize: "14.5px", lineHeight: "1.6", color: "#444" }}>
        {review.content}
      </p>
    </div>
  );
};

// === FORM VIẾT ĐÁNH GIÁ MỚI (giữ nguyên) ===
const ReviewForm = ({ productId, userId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !content.trim()) {
      api.error({ message: "Lỗi", description: "Vui lòng chọn sao và nhập nội dung!" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        reviewer: userId,
        product: productId,
        rating,
        content: content.trim(),
      };

      await appService.createReview(payload);
      api.success({ message: "Thành công", description: "Đánh giá đã được gửi!" });
      setRating(0);
      setContent("");
      onReviewSubmitted();
    } catch (err) {
      api.error({ message: "Lỗi", description: "Không thể gửi đánh giá. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid #e9ecef", borderRadius: "12px", padding: "20px", background: "#fdfdfd" }}>
      {contextHolder}
      <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600" }}>Viết đánh giá của bạn</h3>

      <div style={{ marginBottom: "16px" }}>
        <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#495057" }}>Chọn số sao:</p>
        <div style={{ display: "flex", gap: "6px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              style={{
                background: "none",
                border: "none",
                fontSize: "28px",
                cursor: "pointer",
                color: star <= rating ? "#f39c12" : "#ddd",
                transition: "color 0.2s",
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#495057" }}>Nội dung đánh giá:</p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Chia sẻ trải nghiệm của bạn về pin này..."
          rows={4}
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ced4da",
            borderRadius: "8px",
            fontSize: "14px",
            resize: "vertical",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "12px 24px",
          fontSize: "15px",
          fontWeight: "600",
          background: loading ? "#ccc" : "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Đang gửi..." : "Gửi đánh giá"}
      </button>
    </form>
  );
};

// === MODAL SỬA REVIEW ===
const EditReviewModal = ({ review, onUpdate, onCancel }) => {
  const [rating, setRating] = useState(review.rating);
  const [content, setContent] = useState(review.content);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !content.trim()) {
      api.error({ message: "Lỗi", description: "Vui lòng chọn sao và nhập nội dung!" });
      return;
    }

    setLoading(true);
    try {
      const updatedData = { rating, content: content.trim() };
      await onUpdate(review._id, updatedData);
    } catch (err) {
      api.error({ message: "Lỗi", description: "Không thể cập nhật." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}>
      {contextHolder}
      <div style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "24px",
        width: "90%",
        maxWidth: "500px",
        maxHeight: "80%",
        overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Sửa đánh giá</h3>
          <button onClick={onCancel} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>
            <IoCloseOutline />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#495057" }}>Chọn số sao:</p>
            <div style={{ display: "flex", gap: "6px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "28px",
                    cursor: "pointer",
                    color: star <= rating ? "#f39c12" : "#ddd",
                    transition: "color 0.2s",
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#495057" }}>Nội dung:</p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ced4da",
                borderRadius: "8px",
                fontSize: "14px",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                padding: "10px 20px",
                background: "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 20px",
                background: loading ? "#ccc" : "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};