import React, { useEffect, useState } from "react";
import "./PaymentTest.css";
import { appService } from "../../service/appService";
import {
  calculateShippingFee,
  getDistricts,
  getProvinces,
  getWards,
} from "../../service/ghnService";
import { orderService } from "../../service/orderService";
import { Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";

const bankList = [
  {
    id: "VCB",
    name: "Vietcombank",
    logo: "https://seeklogo.com/images/V/vietcombank-logo-0BB437B119-seeklogo.com.png",
  },
  {
    id: "ACB",
    name: "ACB",
    logo: "https://seeklogo.com/images/A/acb-logo-B7D582B36F-seeklogo.com.png",
  },
  {
    id: "TPB",
    name: "TPBank",
    logo: "https://seeklogo.com/images/T/tpbank-logo-AD487527DE-seeklogo.com.png",
  },
];

export default function PaymentNow() {
  const [selectedMethod, setSelectedMethod] = useState("CASH_ON_DELIVERY");
  const [selectedBank, setSelectedBank] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState("");
  const [fee, setFee] = useState(null);
  const [data, setData] = useState(null);
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const [orderIds, setOrderIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = async () => {
    try {
      const id = orderIds[0];
      const res = await orderService.conformOrderRoot({
        orderCode: id,
        paymentType: selectedMethod,
      });
      setIsModalOpen(false);
      localStorage.removeItem("checkoutProduct");
      setCartItems([]);
      if (selectedMethod === "CASH_ON_DELIVERY") {
        navigate("/settings/buylist");
      } else {
        navigate("/wait-for-payment", { state: { orderIds } });
      }
    } catch (err) {
      console.error(
        "Lỗi xác nhận đơn hàng:",
        err.response?.data || err.message
      );
      alert("Có lỗi xảy ra khi xác nhận đơn hàng.");
    }
  };

  const handleCancel = async () => {
    try {
      await orderService.cancelOrder(orderIds[0]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Lỗi hủy đơn hàng:", err);
      alert("Có lỗi xảy ra khi hủy đơn hàng.");
    }
  };

  useEffect(() => {
    const buyNow = localStorage.getItem("checkoutProduct");
    try {
      const parsed = JSON.parse(buyNow);
      setCartItems(Array.isArray(parsed) ? parsed : [parsed]); // đảm bảo luôn là mảng
    } catch (err) {
      console.error("Lỗi parse JSON:", err);
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await appService.getProfile();
        setReceivers(response.data.metadata.addresses);
        setData(response.data.metadata);
      } catch (error) {
        console.error("Lỗi lấy địa chỉ:", error);
      }
    };
    fetchAddress();
  }, []);

  const handleSelect = (id) => setSelectedBank(id);

  const handleChange = (e) => setSelectedMethod(e.target.value);

  const getAddressCodesFromNames = async (
    provinceName,
    districtName,
    wardName
  ) => {
    try {
      const provinces = await getProvinces();
      const normalize = (name) =>
        name
          ?.toLowerCase()
          .replace(/^tỉnh\s+|^thành phố\s+/i, "")
          .trim();
      const province = provinces.find(
        (p) => normalize(p.ProvinceName) === normalize(provinceName)
      );
      if (!province) return null;

      const districts = await getDistricts(province.ProvinceID);
      const district = districts.find(
        (d) => normalize(d.DistrictName) === normalize(districtName)
      );
      if (!district) return null;

      const wards = await getWards(district.DistrictID);
      const ward = wards.find((w) => w.WardName === wardName);
      if (!ward) return null;

      return {
        district_id: district.DistrictID,
        ward_code: ward.WardCode,
      };
    } catch (error) {
      console.error("Lỗi tra mã vùng:", error);
      return null;
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );
  const shippingFee = typeof fee === "number" ? fee : 0;
  const discount = 20000;
  const total = subtotal + shippingFee - discount;

  useEffect(() => {
    const fetchFee = async () => {
      if (!selectedReceiverId) {
        setFee(null);
        return;
      }
      const selectedReceiver = receivers.find(
        (r) => r.id === Number(selectedReceiverId)
      );
      if (!selectedReceiver) return;

      const addressCodes = await getAddressCodesFromNames(
        selectedReceiver.province,
        selectedReceiver.district,
        selectedReceiver.ward
      );
      if (!addressCodes) {
        setFee("Lỗi");
        return;
      }

      try {
        const res = await calculateShippingFee({
          to_district_id: addressCodes.district_id,
          to_ward_code: addressCodes.ward_code,
          weight: 500,
          length: 20,
          width: 15,
          height: 10,
        });
        setFee(res);
      } catch (error) {
        console.error("Lỗi tính phí:", error);
        setFee("Lỗi");
      }
    };

    fetchFee();
  }, [selectedReceiverId, receivers]);

  const handleOrder = async () => {
    if (!selectedReceiverId) {
      alert("Vui lòng chọn người nhận");
      return;
    }
    if (selectedMethod === "card" && !selectedBank) {
      alert("Vui lòng chọn ngân hàng");
      return;
    }

    const selectedReceiver = receivers.find(
      (r) => r.id === Number(selectedReceiverId)
    );
    const shippingAddress = selectedReceiver
      ? `${selectedReceiver.name}, ${selectedReceiver.phone}, ${selectedReceiver.detail}, ${selectedReceiver.ward}, ${selectedReceiver.district}, ${selectedReceiver.province}`
      : "";

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          productVariantId: item.variantId || item.id,
          quantity: item.quantity,
          version: item.version || 1,
        })),
        shopId: cartItems[0]?.shopId || 1,
        shippingFee: total,
        voucherUserId: null,
        voucherCode: null,
        note: note,
        customerName: data.lastName,
        customerPhone: data.phone,
        shippingAddress: shippingAddress,
      };

      const response = await orderService.postOrder(orderData);
      const orderCode = response.data.metadata.orderCode;
      setIsModalOpen(true);
      setOrderIds([orderCode]);
    } catch (err) {
      console.error("Lỗi khi đặt hàng:", err);
      alert("Đặt hàng thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container2">
        <div className="form-section">
          <h2>Thông tin đơn hàng</h2>
          {receivers.length === 0 ? (
            <p style={{ color: "black" }}>
              Bạn chưa có địa chỉ nhận hàng nào. Vui lòng{" "}
              <Link to="/settings/address">thêm địa chỉ</Link> để tiếp tục.
            </p>
          ) : (
            <select
              value={selectedReceiverId}
              onChange={(e) => setSelectedReceiverId(e.target.value)}
              style={{
                marginBottom: "12px",
                padding: "10px",
                borderRadius: "5px",
                width: "100%",
                outline: "none",
              }}
            >
              <option value="">Chọn người nhận</option>
              {receivers.map((receiver) => (
                <option key={receiver.id} value={receiver.id}>
                  {`${receiver.name} - ${receiver.phone} - ${receiver.detail} / ${receiver.province} / ${receiver.district} / ${receiver.ward}`}
                </option>
              ))}
            </select>
          )}
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ghi chú đơn hàng (nếu có)"
          />

          <h3 style={{ margin: "2% 0" }}>Phương thức vận chuyển</h3>
          <div className="shipping-fee">
            Phí ship đơn hàng {shippingFee.toLocaleString()}đ
          </div>

          <h3>Hình thức thanh toán</h3>
          <div className="payment-method">
            {/* COD */}
            <label style={{ border: "1px solid #ccc", borderRadius: "5px" }}>
              <div
                style={{ display: "flex", alignItems: "center", padding: "2%" }}
              >
                <input
                  style={{ width: "10%" }}
                  type="radio"
                  name="payment"
                  value="CASH_ON_DELIVERY"
                  onChange={handleChange}
                  checked={selectedMethod === "CASH_ON_DELIVERY"}
                />
                <span style={{ width: "90%" }}>
                  Thanh toán khi nhận hàng (COD)
                </span>
              </div>
              {selectedMethod === "CASH_ON_DELIVERY" && (
                <ul style={{ padding: "1% 5%", margin: "0" }}>
                  <li>Khách hàng được kiểm tra hàng trước khi nhận.</li>
                  <li>Freeship đơn từ 250k</li>
                </ul>
              )}
            </label>

            {/* Momo */}
            <label style={{ border: "1px solid #ccc", borderRadius: "5px" }}>
              <div
                style={{ display: "flex", alignItems: "center", padding: "2%" }}
              >
                <input
                  style={{ width: "10%" }}
                  type="radio"
                  name="payment"
                  value="ONLINE_PAYMENT"
                  onChange={handleChange}
                  checked={selectedMethod === "ONLINE_PAYMENT"}
                />
                <span style={{ width: "90%" }}>Thanh toán Momo</span>
              </div>
            </label>

            {/* Card */}
            <label style={{ border: "1px solid #ccc", borderRadius: "5px" }}>
              <div
                style={{ display: "flex", alignItems: "center", padding: "2%" }}
              >
                <input
                  style={{ width: "10%" }}
                  type="radio"
                  name="payment"
                  value="card"
                  onChange={handleChange}
                  checked={selectedMethod === "card"}
                />
                <span style={{ width: "90%" }}>Thẻ tín dụng / ngân hàng</span>
              </div>
              {selectedMethod === "card" && (
                <ul
                  style={{
                    padding: "1% 5%",
                    margin: 0,
                    display: "flex",
                    gap: "30px",
                    listStyle: "none",
                    flexWrap: "wrap",
                  }}
                >
                  {bankList.map((bank) => (
                    <li key={bank.id} style={{ textAlign: "center" }}>
                      <img
                        src={bank.logo}
                        alt={bank.name}
                        style={{
                          height: 40,
                          objectFit: "contain",
                          marginBottom: 6,
                        }}
                      />
                      <div>
                        <input
                          type="radio"
                          name="bank"
                          value={bank.id}
                          checked={selectedBank === bank.id}
                          onChange={() => handleSelect(bank.id)}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </label>
          </div>
        </div>

        {/* Giỏ hàng */}
        <div className="cart-section">
          <h2>Giỏ hàng</h2>
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="cart-item"
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  marginRight: 10,
                  borderRadius: 8,
                }}
              />
              <div className="item-details">
                <p
                  style={{
                    margin: 0,
                    color: item.quantity > 0 ? "black" : "red",
                  }}
                >
                  {item.name} {item.quantity === 0 && "(Hết hàng)"}
                </p>
                <p style={{ margin: 0, color: "black" }}>
                  Giá: {(item.price || 0).toLocaleString()}đ
                </p>
                <p style={{ margin: 0, color: "black" }}>
                  Số lượng: {item.quantity}
                </p>
              </div>
            </div>
          ))}

          <h3>Ưu Đãi Dành Cho Bạn</h3>
          <div className="voucher-box">
            <input placeholder="Nhập mã giảm giá" />
            <button>Áp dụng</button>
          </div>

          <div className="summary">
            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{subtotal.toLocaleString()}đ</span>
            </div>
            <div className="summary-row">
              <span>Phí vận chuyển:</span>
              <span>{shippingFee.toLocaleString()}đ</span>
            </div>
            <div className="summary-row">
              <span>Giảm giá đơn hàng:</span>
              <span>-{discount.toLocaleString()}đ</span>
            </div>
            <div className="summary-row total">
              <strong>Tổng:</strong>
              <strong>{total.toLocaleString()}đ</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Nút đặt hàng */}
      <div
        style={{
          position: "fixed",
          bottom: "0",
          width: "100%",
          boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          left: "0",
        }}
        className="place-order"
      >
        <div
          style={{
            display: "flex",
            alignContent: "center",
            marginLeft: "5%",
            width: "60%",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              margin: "0",
              color: "black",
              fontSize: "18px",
              borderRight: "1px solid black",
              padding: "3% 20% 3% 5%",
            }}
          >
            {selectedMethod === "CASH_ON_DELIVERY"
              ? "Thanh toán khi nhận hàng"
              : selectedMethod === "ONLINE_PAYMENT"
              ? "Thanh toán Momo"
              : "Thẻ tín dụng / ngân hàng"}
          </p>
          <span style={{ fontSize: "18px", padding: "3% 0% 3% 0%" }}>
            Chưa dùng voucher
          </span>
        </div>
        <button onClick={handleOrder}>Đặt hàng</button>
      </div>

      {/* Modal xác nhận */}
      <Modal
        title="Xác nhận đơn hàng"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ marginTop: "10%" }}
      >
        <p style={{ color: "black" }}>
          Bạn có chắc chắn muốn xác nhận đơn hàng?
        </p>
      </Modal>
    </div>
  );
}
