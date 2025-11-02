import React, { useState, useEffect } from "react";
import "./Payment.css"; // Giữ file CSS đã cung cấp trước đó
import ProductLike from "../DetailProduct/ProductLike";
import { useNavigate } from "react-router-dom";
import {
  getDistricts,
  getEstimatedDeliveryTime,
  getProvinces,
  getWards,
} from "../../service/ghnService";

export default function Payment() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [selectedWardCode, setSelectedWardCode] = useState("");

  const [leadtime, setLeadtime] = useState(null);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
    setSelectedItems(storedCart.map((item) => item.id));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllSelected = selectedItems.length === cartItems.length && cartItems.length > 0;

  const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item.id));
  const total = selectedCartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const updateQuantity = (id, change) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + change) }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      const result = await getProvinces();
      setProvinces(result || []);
    };
    fetchProvinces();
  }, []);

  const handleProvinceChange = async (e) => {
    const provinceId = parseInt(e.target.value);
    setSelectedProvinceId(provinceId);
    setSelectedDistrictId(null);
    setSelectedWardCode("");
    setWards([]);
    setLeadtime(null);
    if (provinceId) {
      const districtsData = await getDistricts(provinceId);
      setDistricts(districtsData || []);
    }
  };

  const handleDistrictChange = async (e) => {
    const districtId = parseInt(e.target.value);
    setSelectedDistrictId(districtId);
    setSelectedWardCode("");
    setLeadtime(null);
    if (districtId) {
      const wardsData = await getWards(districtId);
      setWards(wardsData || []);
    }
  };

  const handleWardChange = (e) => {
    setSelectedWardCode(e.target.value);
  };

  useEffect(() => {
    const fetchLeadtime = async () => {
      if (selectedDistrictId && selectedWardCode) {
        const lead = await getEstimatedDeliveryTime({
          to_district_id: selectedDistrictId,
          to_ward_code: selectedWardCode,
          service_id: 53320,
        });
        if (lead?.formatted) {
          setLeadtime(new Date(lead.formatted));
        }
      }
    };
    fetchLeadtime();
  }, [selectedDistrictId, selectedWardCode]);

  const formatDate = (date) => {
    if (!date) return "Đang cập nhật...";
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="payment-symmetric-container">
        {/* Bên trái: Giỏ hàng - Chiếm 65% chiều rộng, cố định chiều cao để scroll độc lập */}
        <div className="cart-section-symmetric">
          <div className="cart-header-symmetric">
            <label className="select-all-checkbox">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
              />
              <span>Chọn tất cả ({selectedItems.length} sản phẩm)</span>
            </label>
          </div>

          <div className="cart-items-list-symmetric">
            {cartItems.length === 0 ? (
              <p className="empty-cart">Giỏ hàng trống. Hãy thêm sản phẩm!</p>
            ) : (
              cartItems.map((item) => (
                <div className="cart-item-card-symmetric" key={item.id}>
                  <div className="item-select">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                    />
                  </div>

                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    className="item-image-symmetric"
                    onClick={() => navigate(`/product/${item.id}`)}
                  />

                  <div className="item-details-symmetric">
                    <h4
                      className="item-name"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      {item.name}
                    </h4>
                    <p className="item-color">Màu: {item.color || "Không rõ"}</p>

                    <div className="item-quantity-symmetric">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Giảm"
                      >
                        −
                      </button>
                      <span>{item.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Tăng"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="item-price-symmetric">
                    {(item.price * (item.quantity || 1)).toLocaleString("vi-VN")}₫
                  </div>

                  <button
                    className="delete-btn-symmetric"
                    onClick={() => deleteItem(item.id)}
                    aria-label="Xóa"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bên phải: Thông tin đơn hàng - Chiếm 35% chiều rộng, cố định (sticky) */}
        <div className="order-summary-symmetric">
          <h3>Thông tin đơn hàng</h3>

          <div className="summary-details">
            <div className="summary-row">
              <span>Tạm tính ({selectedItems.length} sp):</span>
              <strong>{total.toLocaleString("vi-VN")}₫</strong>
            </div>
            <div className="summary-row">
              <span>Giảm giá:</span>
              <strong>0₫</strong>
            </div>
            <div className="summary-row total">
              <span>Tổng cộng:</span>
              <strong className="grand-total">{total.toLocaleString("vi-VN")}₫</strong>
            </div>
          </div>

          <div className="delivery-estimate">
            <h4>Ước tính giao hàng</h4>
            <p style={{color: 'black'}} className="leadtime-text">{formatDate(leadtime)}</p>
          </div>

          <div className="address-section-symmetric">
            <h4>Địa chỉ nhận hàng</h4>
            <select
              value={selectedProvinceId || ""}
              onChange={handleProvinceChange}
              className="address-select-symmetric"
            >
              <option value="">Tỉnh/Thành phố</option>
              {provinces.map((p) => (
                <option key={p.ProvinceID} value={p.ProvinceID}>
                  {p.ProvinceName}
                </option>
              ))}
            </select>

            <select
              value={selectedDistrictId || ""}
              onChange={handleDistrictChange}
              disabled={!selectedProvinceId}
              className="address-select-symmetric"
            >
              <option value="">Quận/Huyện</option>
              {districts.map((d) => (
                <option key={d.DistrictID} value={d.DistrictID}>
                  {d.DistrictName}
                </option>
              ))}
            </select>

            <select
              value={selectedWardCode}
              onChange={handleWardChange}
              disabled={!selectedDistrictId}
              className="address-select-symmetric"
            >
              <option value="">Phường/Xã</option>
              {wards.map((w) => (
                <option key={w.WardCode} value={w.WardCode}>
                  {w.WardName}
                </option>
              ))}
            </select>
          </div>

          <div className="coupon-section">
            <input
              type="text"
              placeholder="Mã khuyến mãi"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="coupon-input"
            />
            <button className="apply-coupon-btn">Áp dụng</button>
          </div>

          <button
            className="checkout-btn-symmetric"
            disabled={selectedItems.length === 0 || !selectedWardCode}
            onClick={() => navigate("/payment")}
          >
            {selectedItems.length === 0 ? "Chọn sản phẩm" : "THANH TOÁN NGAY"}
          </button>

          <p className="secure-note">
            An toàn • Miễn phí ship đơn > 500k
          </p>
        </div>
      </div>

      <div className="recommended-section">
        <ProductLike />
      </div>
    </>
  );
}