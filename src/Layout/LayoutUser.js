import React, { useState } from "react";
import HeaderPage from "../Components/Header/HeaderPage";
import "./layout.css";
import { useNavigate } from "react-router-dom";
import FooterPage from "../Components/Footer/FooterPage"

// eslint-disable-next-line import/no-anonymous-default-export
export default function ({ Component }) {

  const [a1, setA1] = useState(true);
  const [a2, setA2] = useState(false);
  const [a3, setA3] = useState(false);
  const [a4, setA4] = useState(false);
  const [a5, setA5] = useState(false);
  const [a6, setA6] = useState(false);
  const [a7, setA7] = useState(false);
  const [a8, setA8] = useState(false);
  const [a9, setA9] = useState(false);
  const [a10, setA10] = useState(false);
  const [a11, setA11] = useState(false);
  const [a12, setA12] = useState(false);
  const [a13, setA13] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="layoutuser">
      <HeaderPage />
      <div
        style={{
          background: "#F2ECEC",
          width: "100%",
          padding: "9% 0 1% 0",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            overflow: "hidden",
            height: "100%",
          }}
        >
          <div
            style={{
              width: "20%",
              background: "white",
              marginRight: "1%",
              padding: "3% 3%",
              lineHeight: "80%",
            }}
          >
            <h5>Tài khoản của tôi</h5>
            <div style={{ marginLeft: '6%', marginTop: '10%'}}>
              <p
                className={a1 ? "active" : ""}
                onClick={() => {
                  navigate('/settings');
                  setA1(true);
                  setA2(false);
                  setA3(false);
                  setA4(false);
                  setA5(false)
                  setA6(false)
                  setA7(false)
                  setA12(false)
                  setA11(false)
                  setA10(false)
                  setA8(false)
                  setA9(false)
                  setA13(false)
                }}
              >Hồ Sơ</p>
              <p className={a2 ? "active" : ""}
                onClick={() => {
                //   navigate('/order');
                  setA1(false);
                  setA2(true);
                  setA3(false);
                  setA4(false);
                  setA5(false);
                  setA6(false);
                  setA7(false);
                  setA12(false);
                  setA11(false);
                  setA10(false);
                  setA8(false);
                  setA9(false);
                  setA13(false);
                }}>Ngân hàng</p>
              <p
                className={a3 ? "active" : ""}
                onClick={() => {
                  navigate('/settings/address');
                  setA1(false);
                  setA3(true);
                  setA2(false);
                  setA4(false);
                  setA5(false);
                  setA6(false);
                  setA7(false);
                  setA12(false);
                  setA11(false);
                  setA10(false);
                  setA8(false);
                  setA9(false);
                  setA13(false);
                }}
              >Địa chỉ</p>
              <p
                className={a4 ? "active" : ""}
                onClick={() => {
                  navigate('/settings/changepass');
                  setA1(false);
                  setA4(true);
                  setA2(false);
                  setA3(false);
                  setA5(false);
                  setA6(false);
                  setA7(false);
                  setA12(false);
                  setA11(false);
                  setA10(false);
                  setA8(false);
                  setA9(false);
                  setA13(false);
                }}
              >Đổi mật khẩu</p>
              <p
                className={a5 ? "active" : ""}
                onClick={() => {
                  
                  setA1(false);
                  setA5(true);
                  setA2(false);
                  setA3(false);
                  setA4(false);
                  setA6(false);
                  setA7(false);
                  setA12(false);
                  setA11(false);
                  setA10(false);
                  setA8(false);
                  setA9(false);
                  setA13(false);
                }}
              >Cài đặt thông báo</p>
            </div>
            <h5>Đơn mua</h5>
            <div style={{ marginLeft: '6%', marginTop: '10%'}}>
              <p
                className={a6 ? "active" : ""}
                onClick={() => {
                  navigate('/settings/buylist');
                  setA1(false);
                  setA6(true);
                  setA2(false);
                  setA3(false);
                  setA4(false);
                  setA5(false);
                  setA7(false);
                  setA12(false);
                  setA11(false);
                  setA10(false);
                  setA8(false);
                  setA9(false);
                  setA13(false);
                }}
              >Tất cả</p>
              <p
                className={a7 ? "active" : ""}
                onClick={() => {
                //   navigate('/order');
                  setA1(false);
                  setA7(true);
                  setA2(false);
                  setA3(false);
                  setA4(false);
                  setA6(false);
                  setA5(false);
                  setA12(false);
                  setA11(false);
                  setA10(false);
                  setA8(false);
                  setA9(false);
                  setA13(false);
                }}
              >Chờ thanh toán</p>
              <p
                className={a8 ? "active" : ""}
                onClick={() => {
                //   navigate('/order');
                  setA1(false);
                  setA8(true);
                  setA2(false);
                  setA3(false);
                  setA4(false);
                  setA6(false);
                  setA7(false);
                  setA12(false);
                  setA11(false);
                  setA10(false);
                  setA5(false);
                  setA9(false);
                  setA13(false);
                }}
              >Chờ giao hàng</p>
              <p
                className={a9 ? "active" : ""}
                onClick={() => {
                //   navigate('/order');
                  setA1(false);
                  setA9(true);
                  setA2(false);
                  setA3(false);
                  setA4(false);
                  setA6(false);
                  setA7(false);
                  setA12(false);
                  setA11(false);
                  setA10(false);
                  setA8(false);
                  setA5(false);
                  setA13(false);
                }}
              >Đã giao</p>
              <p
                className={a10 ? "active" : ""}
                onClick={() => {
                //   navigate('/order');
                  setA1(false);
                  setA10(true);
                  setA2(false);
                  setA3(false);
                  setA4(false);
                  setA6(false);
                  setA7(false);
                  setA12(false);
                  setA11(false);
                  setA5(false);
                  setA8(false);
                  setA9(false);
                  setA13(false);
                }}
              >Đã hủy</p>
              <p
                className={a11 ? "active" : ""}
                onClick={() => {
                //   navigate('/order');
                  setA1(false);
                  setA11(true);
                  setA2(false);
                  setA3(false);
                  setA4(false);
                  setA6(false);
                  setA7(false);
                  setA12(false);
                  setA5(false);
                  setA10(false);
                  setA8(false);
                  setA9(false);
                  setA13(false);
                }}
              >Trả lại</p>
            </div>
            <h5>Voucher</h5>
          </div>
          <div
            style={{
              width: "100%",
            }}
          >
            <Component />
          </div>
        </div>
      </div>
      <FooterPage />
    </div>
  );
}
