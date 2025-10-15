import React, { useState, useEffect } from "react";
import "./Payment.css";
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

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
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
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const isAllSelected = selectedItems.length === cartItems.length;

  const total = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const updateQuantity = (id, change) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = (item.quantity || 1) + change;
        return {
          ...item,
          quantity: newQuantity > 0 ? newQuantity : 1,
        };
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  const deleteItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      const result = await getProvinces();
      setProvinces(result);
    };
    fetchProvinces();
  }, []);

  const handleProvinceChange = async (e) => {
    const provinceId = parseInt(e.target.value);
    setSelectedProvinceId(provinceId);
    const districts = await getDistricts(provinceId);
    setDistricts(districts);
    setSelectedDistrictId(null);
    setWards([]);
    setSelectedWardCode("");
  };

  const handleDistrictChange = async (e) => {
    const districtId = parseInt(e.target.value);
    setSelectedDistrictId(districtId);
    const wards = await getWards(districtId);
    setWards(wards);
    setSelectedWardCode("");
  };

  useEffect(() => {
    const fetchLeadtime = async () => {
      if (selectedDistrictId && selectedWardCode) {
        const lead = await getEstimatedDeliveryTime({
          to_district_id: selectedDistrictId,
          to_ward_code: selectedWardCode,
          service_id: 53320,
        });
        if (lead) setLeadtime(lead);
      }
    };
    fetchLeadtime();
  }, [selectedDistrictId, selectedWardCode]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "2% 5%",
          backgroundColor: "#f8f8f8",
          boxSizing: "border-box",
          gap: "2%",
        }}
      >
        <div className="cart-section">
          <div className="select-all">
            <input
              style={{ width: "16px", height: "16px" }}
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAll}
            />
            <span>Chọn tất cả ({selectedItems.length})</span>
          </div>
          <hr />
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <input
                style={{ width: "16px", height: "16px" }}
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => handleSelectItem(item.id)}
              />
              <img
                onClick={() => navigate(`/product/${item.id}`)}
                src={item.image}
                alt={item.name}
              />
              <div className="item-info">
                <div
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="item-name"
                  style={{ cursor: "pointer" }}
                >
                  {item.name}
                </div>
                <div className="item-color">{item.color}</div>
                <div className="quantity">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    style={{ border: "none", background: "transparent" }}
                  >
                    -
                  </button>
                  <input
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      width: "30px",
                      textAlign: "center",
                    }}
                    type="text"
                    value={item.quantity || 1}
                    readOnly
                  />
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    style={{ border: "none", background: "transparent" }}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="item-price">
                {(item.price * (item.quantity || 1)).toLocaleString()}₫
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="delete"
                style={{ border: "none", background: "transparent" }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div>
          <div className="order-summary">
            <h3>Thông tin đơn hàng</h3>
            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{total.toLocaleString()}₫</span>
            </div>
            <div className="summary-row">
              <span>Giảm giá:</span>
              <span>0₫</span>
            </div>
            <div className="summary-row total" style={{ marginBottom: "5%" }}>
              <span>Tổng cộng:</span>
              <span>{total.toLocaleString()}₫</span>
            </div>

            <h4>Ước tính thời gian giao hàng</h4>
            <p style={{ color: "black" }}>
              {leadtime
                ? leadtime.toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Đang cập nhật..."}
            </p>

            <div className="shipping">
              <select
                style={{
                  padding: "10px 0",
                  borderRadius: "5px",
                  outline: "none",
                  width: "45%",
                }}
                onChange={handleProvinceChange}
                value={selectedProvinceId || ""}
              >
                <option value="">Chọn tỉnh/ thành phố</option>
                {provinces.map((p) => (
                  <option key={p.ProvinceID} value={p.ProvinceID}>
                    {p.ProvinceName}
                  </option>
                ))}
              </select>

              <select
                style={{
                  padding: "10px 0",
                  borderRadius: "5px",
                  outline: "none",
                  width: "45%",
                }}
                onChange={handleDistrictChange}
                value={selectedDistrictId || ""}
                disabled={!selectedProvinceId}
              >
                <option value="">Chọn quận/ huyện</option>
                {districts.map((d) => (
                  <option key={d.DistrictID} value={d.DistrictID}>
                    {d.DistrictName}
                  </option>
                ))}
              </select>

              <select
                style={{
                  padding: "10px 0",
                  borderRadius: "5px",
                  outline: "none",
                  width: "45%",
                  marginTop: "10px",
                }}
                onChange={(e) => setSelectedWardCode(e.target.value)}
                value={selectedWardCode}
                disabled={!selectedDistrictId}
              >
                <option value="">Chọn phường/ xã</option>
                {wards.map((w) => (
                  <option key={w.WardCode} value={w.WardCode}>
                    {w.WardName}
                  </option>
                ))}
              </select>
            </div>

            <input
              style={{
                padding: "10px",
                borderRadius: "5px",
                outline: "none",
                width: "100%",
                marginBottom: "5%",
                marginTop: "5%",
              }}
              type="text"
              placeholder="Nhập mã khuyến mãi nếu có"
              className="coupon"
            />

            <button onClick={() => navigate("/payment")} className="checkout-btn">
              THANH TOÁN NGAY
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "10%" }}>
        <ProductLike />
      </div>
    </>
  );
}
