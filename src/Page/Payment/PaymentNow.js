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
import { Modal, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "antd";
import {
  CheckCircleOutlined,
  CreditCardOutlined,
  WalletOutlined,
  TruckOutlined,
} from "@ant-design/icons";

const bankList = [
  {
    id: "vietcombank",
    name: "Vietcombank",
    logo: "https://logo.example.com/vietcombank.png",
  },
  {
    id: "bidv",
    name: "BIDV",
    logo: "https://logo.example.com/bidv.png",
  },
  {
    id: "techcombank",
    name: "Techcombank",
    logo: "https://logo.example.com/techcombank.png",
  },
];

// Danh sách voucher mẫu (có thể fetch từ API)
const AVAILABLE_VOUCHERS = [
  { code: "VINE", discount: 10000 },
  { code: "FREESHIP", discount: 25000 }, // freeship giả lập giảm phí ship
  { code: "GIAM20K", discount: 20000 },
  { code: "TEST50K", discount: 50000 },
];

export default function PaymentNow() {
  const [selectedMethod, setSelectedMethod] = useState("cod");
  const [selectedBank, setSelectedBank] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState("");
  const [fee, setFee] = useState(null);
  const [datas, setData] = useState(); // profile user
  const [note, setNote] = useState("");
  const [orderIds, setOrderIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAr, setIsAr] = useState();

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type, message, description) => {
    api[type]({ message, description });
  };
  
  // Voucher states
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null); // { code, discount }
  
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const shippingFee = typeof fee === "number" ? fee : 0;
  
  // Tính discount từ voucher
  const voucherDiscount = appliedVoucher 
    ? (appliedVoucher.code === "FREESHIP" ? shippingFee : appliedVoucher.discount)
    : 20000; // default fallback hoặc 0 nếu muốn
  
  const total = subtotal + shippingFee - voucherDiscount;

  // Kiểm tra trạng thái đăng nhập
  const isLoggedIn = !!datas;

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    setCartItems(stored ? JSON.parse(stored) : []);
  }, []);

  // Load applied voucher từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("appliedVoucher");
    if (saved) {
      setAppliedVoucher(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await appService.getProfile();
        console.log(res.data.user);
        setReceivers(res.data.user.address || []);
        setData(res.data.user);
        setIsAr(res.data.user.address);
      } catch (err) {
        setReceivers([]);
        message.error("Vui lòng đăng nhập để đặt hàng");
      }
    };
    fetchProfile();
  }, []);

  const getAddressCodesFromNames = async (
    provinceName,
    districtName,
    wardName
  ) => {
    try {
      const provinces = await getProvinces();
      const normalize = (str) =>
        str
          ?.toLowerCase()
          .replace(/^(tỉnh|thành phố)\s+/i, "")
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

      return { district_id: district.DistrictID, ward_code: ward.WardCode };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    const fetchFee = async () => {
      if (!selectedReceiverId || !isLoggedIn) return setFee(null);
      const receiver = receivers.find(
        (r) => r.id === Number(selectedReceiverId)
      );
      if (!receiver) return;

      const codes = await getAddressCodesFromNames(
        receiver.province,
        receiver.district,
        receiver.ward
      );
      if (!codes) return setFee("Lỗi");

      try {
        const res = await calculateShippingFee({
          to_district_id: codes.district_id,
          to_ward_code: codes.ward_code,
          weight: 500,
          length: 20,
          width: 15,
          height: 10,
        });
        setFee(res);
      } catch (err) {
        setFee("Lỗi");
      }
    };
    fetchFee();
  }, [selectedReceiverId, receivers, isLoggedIn, appliedVoucher]); // recalculate khi voucher thay đổi

  // Áp dụng voucher
  const applyVoucher = () => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để sử dụng voucher");
      return;
    }
    const code = voucherInput.trim().toUpperCase();
    if (!code) {
      message.warning("Vui lòng nhập mã voucher");
      return;
    }

    const voucher = AVAILABLE_VOUCHERS.find(v => v.code === code);
    if (!voucher) {
      message.error("Mã voucher không hợp lệ");
      return;
    }

    setAppliedVoucher(voucher);
    localStorage.setItem("appliedVoucher", JSON.stringify(voucher));
    setVoucherInput("");
    message.success(`Áp dụng mã ${code} thành công! Giảm ${voucher.code === "FREESHIP" ? "phí ship" : `${voucher.discount.toLocaleString()}₫`}`);
  };

  // Xóa voucher
  const removeVoucher = () => {
    setAppliedVoucher(null);
    localStorage.removeItem("appliedVoucher");
    message.info("Đã xóa voucher");
  };

  const handleOrder = async () => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để đặt hàng");
      return;
    }
    const data = {
      order_type: "direct",
      product: cartItems[0].id,
      auction: "",
      voucher: appliedVoucher?.code || "", // gửi voucher nếu có
      payment: selectedMethod,
    };

    
    try {
      const res = await orderService.postOrder(data);
      openNotification("success", "Thành công", "Đặt hàng thành công!");
      setTimeout(() => {
        localStorage.setItem("cart", JSON.stringify([]));
        navigate("/");
      }, 1500);
    } catch (error) {
      openNotification("error", "Thất bại", "Đặt hàng thất bại!");
      console.error(error);
      return;
    }
    console.log(data);
  };

  const handleOk = async () => {
    try {
      for (const id of orderIds) {
        await orderService.conformOrderRoot({
          orderCode: id,
          paymentType: selectedMethod,
        });
      }
      localStorage.removeItem("cart");
      localStorage.removeItem("appliedVoucher"); // xóa voucher sau khi đặt hàng
      setCartItems([]);
      setAppliedVoucher(null);
      setIsModalOpen(false);
      message.success("Đặt hàng thành công!");
      navigate(
        selectedMethod === "online"
          ? "/wait-for-payment"
          : "/settings/buylist",
        { state: { orderIds } }
      );
    } catch (err) {
      message.error("Xác nhận thất bại!");
    }
  };

  const handleCancel = async () => {
    try {
      await Promise.all(orderIds.map((id) => orderService.cancelOrder(id)));
      message.info("Đã hủy đơn hàng.");
      setIsModalOpen(false);
    } catch (err) {
      message.error("Hủy thất bại!");
    }
  };

  return (
    <>
    {contextHolder}
      <div style={{ paddingBottom: "10%" }} className="payment-symmetric">
        {/* Bên trái: Form + Phương thức */}
        <div className="payment-left">
          <h2 style={{ color: "black" }} className="section-title">
            Thông tin đơn hàng
          </h2>

          {!isLoggedIn ? (
            <div className="no-address">
              <p style={{ color: "black" }}>
                Bạn cần đăng nhập để chọn địa chỉ nhận hàng.
              </p>
            </div>
          ) : receivers.length === 0 ? (
            <div className="no-address">
              <p style={{ color: "black" }}>
                Chưa có địa chỉ nhận hàng. Vui lòng{" "}
                <Link to="/settings/address">thêm ngay</Link>
              </p>
            </div>
          ) : (
            <div>
              <p style={{ color: "black" }}>Địa Chỉ nhận hàng : </p>
              <p style={{ color: "black" }}>{receivers}</p>
            </div>
          )}

          <div className="shipping-info">
            <TruckOutlined /> <strong>Phí vận chuyển:</strong>{" "}
            {fee !== null ? `${fee.toLocaleString()}₫` : "Đang tính..."}
          </div>

          <h3 className="section-title">Hình thức thanh toán</h3>
          <div
            className="payment-methods"
            style={{
              pointerEvents: isLoggedIn ? "auto" : "none",
              opacity: isLoggedIn ? 1 : 0.6,
            }}
          >
            {/* COD */}
            <label
              className={`method-card ${
                selectedMethod === "cod" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={selectedMethod === "cod"}
                onChange={(e) => setSelectedMethod(e.target.value)}
                disabled={!isLoggedIn}
              />
              <div className="method-content">
                <WalletOutlined className="method-icon" />
                <div>
                  <strong>Thanh toán khi nhận hàng (COD)</strong>
                  <p style={{ color: "black" }}>
                    Freeship đơn từ 250k • Kiểm tra hàng trước khi thanh toán
                  </p>
                </div>
              </div>
            </label>

            {/* Momo */}
            <label
              className={`method-card ${
                selectedMethod === "online" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="online"
                checked={selectedMethod === "online"}
                onChange={(e) => setSelectedMethod(e.target.value)}
                disabled={!isLoggedIn}
              />
              <div className="method-content">
                <img
                  src="https://momo.vn/img/logo.png"
                  alt="Momo"
                  className="momo-logo"
                />
                <strong>Thanh toán qua Momo</strong>
              </div>
            </label>

            {selectedMethod === "card" && (
              <div className="bank-grid">
                {bankList.map((bank) => (
                  <div
                    key={bank.id}
                    className={`bank-item ${
                      selectedBank === bank.id ? "selected" : ""
                    }`}
                    onClick={() => isLoggedIn && setSelectedBank(bank.id)}
                  >
                    <img src={bank.logo} alt={bank.name} />
                    <p>{bank.name}</p>
                    <input
                      type="radio"
                      name="bank"
                      checked={selectedBank === bank.id}
                      readOnly
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bên phải: Giỏ hàng + Tổng */}
        <div className="payment-right">
          <div className="cart-summary">
            <h2>Giỏ hàng ({cartItems.length} sản phẩm)</h2>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <p style={{ color: "black" }} className="item-name">
                      {item.name}
                    </p>
                    <p className="item-price">
                      {(item.price * item.quantity).toLocaleString()}₫
                    </p>
                    <p style={{ color: "black" }} className="item-quantity">
                      x{item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="voucher-section">
              <h3>Ưu đãi dành cho bạn</h3>
              <div className="voucher-input">
                <input 
                  placeholder="Nhập mã giảm giá" 
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyVoucher()}
                  disabled={!isLoggedIn} 
                />
                <button onClick={applyVoucher} disabled={!isLoggedIn}>
                  Áp dụng
                </button>
              </div>

              {/* Voucher đã áp dụng */}
              {appliedVoucher && (
                <div className="applied-voucher">
                  <span className="voucher-tag">
                    {appliedVoucher.code}
                    <button className="remove-voucher" onClick={removeVoucher}>×</button>
                  </span>
                  <p style={{ color: "#52c41a", fontSize: "12px" }}>
                    Đã áp dụng: Giảm {appliedVoucher.code === "FREESHIP" ? "phí ship" : `${appliedVoucher.discount.toLocaleString()}₫`}
                  </p>
                </div>
              )}

              {/* Gợi ý voucher */}
              <div className="voucher-tags">
                {AVAILABLE_VOUCHERS.map(v => (
                  <span key={v.code} onClick={() => {
                    setVoucherInput(v.code);
                    applyVoucher();
                  }}>
                    {v.code}
                  </span>
                ))}
              </div>
            </div>

            <div className="price-summary">
              <div className="price-row">
                <span>Tạm tính</span>
                <span>{subtotal.toLocaleString()}₫</span>
              </div>
              <div className="price-row">
                <span>Phí vận chuyển</span>
                <span>{shippingFee.toLocaleString()}₫</span>
              </div>
              <div className="price-row discount">
                <span>Giảm giá{voucherDiscount > 0 ? ` (${appliedVoucher?.code || "GIAM20K"})` : ""}</span>
                <span>-{voucherDiscount.toLocaleString()}₫</span>
              </div>
              <div className="price-row total">
                <strong>Tổng cộng</strong>
                <strong className="grand-total">
                  {total.toLocaleString()}₫
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thanh toán cố định */}
      <div className="fixed-bottom-bar">
        <div className="bar-content">
          <div className="payment-info">
            <p>
              {selectedMethod === "cod" && "Thanh toán khi nhận hàng"}
              {selectedMethod === "online" && "Thanh toán Momo"}
              {selectedMethod === "card" && "Thẻ ngân hàng"}
            </p>
            <span>
              {appliedVoucher ? `Đã dùng ${appliedVoucher.code}` : "Chưa dùng voucher"}
            </span>
          </div>
          <button
            className="place-order-btn"
            onClick={handleOrder}
            disabled={!isLoggedIn || cartItems.length === 0}
            style={{ opacity: !isLoggedIn || cartItems.length === 0 ? 0.6 : 1 }}
          >
            {!isLoggedIn
              ? "Vui lòng đăng nhập"
              : `Đặt hàng • ${total.toLocaleString()}₫`}
          </button>
        </div>
      </div>

      {/* Modal xác nhận */}
      <Modal
        title={
          <>
            <CheckCircleOutlined style={{ color: "#52c41a" }} /> Xác nhận đặt
            hàng
          </>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xác nhận thanh toán"
        cancelText="Hủy đơn"
        width={420}
      >
        <div className="modal-content">
          <p>
            <strong>Tổng thanh toán:</strong> {total.toLocaleString()}₫
          </p>
          <p>
            <strong>Phương thức:</strong>{" "}
            {selectedMethod === "cod"
              ? "COD"
              : selectedMethod === "online"
              ? "Momo"
              : "Thẻ ngân hàng"}
          </p>
          <p>
            <strong>Voucher:</strong> {appliedVoucher?.code || "Không"}
          </p>
          <p>
            <strong>Số đơn hàng:</strong> {orderIds.length} đơn
          </p>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Sau khi xác nhận, đơn hàng sẽ được xử lý ngay lập tức.
          </p>
        </div>
      </Modal>
    </>
  );
}