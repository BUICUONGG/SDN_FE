import React, { useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa";
import "./foter.css";

export default function FooterPage() {
  const [mb, setMb] = useState(false);
  const [mp, setMp] = useState(false);
  const [ip, setIp] = useState(false);
  const [dt, setDt] = useState(false);

  useEffect(() => {
    const updateSlidesToShow = () => {
      const width = window.innerWidth;

      if (width < 480) {
        setIp(false);
        setMp(false);
        setMb(true);
        setDt(false);
      } else if (width < 768) {
        setIp(false);
        setMp(true);
        setMb(false);
        setDt(false);
      } else if (width < 1024) {
        setIp(true);
        setMp(false);
        setMb(false);
        setDt(false);
      } else {
        setIp(false);
        setMp(false);
        setMb(false);
        setDt(true);
      }
    };

    updateSlidesToShow(); // Cập nhật lần đầu

    window.addEventListener("resize", updateSlidesToShow); // Lắng nghe resize

    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);
  return (
    <>
      {dt && (
        <footer
          style={{
            padding: "30px 20%",
            background: "#6EB566",
            color: "white",
            width: "100%",
          }}
        >
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "70px" }} className="font-xmark">
              xmark
            </h1>
            <p>
              <FaPhone /> Tổng đài CSKH: 0946744287
            </p>
            <p>
              <FaEnvelope /> Email: namtran34311@gmail.com
            </p>
            <h6>Theo dõi xmark</h6>
            <p>
              <a href="https://www.facebook.com/profile.php?id=61574917165179" target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "none" }}>
                <FaFacebook /> Facebook
              </a>
            </p>
            <p>
              <a href="https://www.instagram.com/xmark_2hand/" target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "none" }}>
                <FaInstagram /> Instagram
              </a>
            </p>
          </div>

          <div style={{ flex: 1 }}>
            <h5>HỖ TRỢ KHÁCH HÀNG</h5>
            <p>Chính sách đổi hàng và bảo hành</p>
            <p>Chính sách thành viên</p>
            <p>Chính sách ưu đãi sinh nhật</p>
            <p>Chính sách bảo mật</p>
            <p>Chính sách giao hàng</p>
          </div>

          <div style={{ flex: 1 }}>
            <h5>Về xmark</h5>
            <p>Câu chuyện thương hiệu</p>
            <p>Giá trị cốt lõi</p>
            <p>Trách nhiệm cộng đồng</p>
            <p>Tìm hiểu nguyên liệu</p>
          </div>
        </footer>
      )}
      {ip && (
        <footer
          style={{
            padding: "30px 20%",
            background: "#6EB566",
            color: "white",
            width: "100%",
            fontSize: "16px",
          }}
        >
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "50px" }} className="font-xmark">
              xmark
            </h1>
            <p>
              <FaPhone /> Tổng đài CSKH: 0829982028
            </p>
            <p>
              <FaEnvelope /> Email: cskh@xmark.com
            </p>
            <h6>Theo dõi xmark</h6>
            <p>
              <FaFacebook /> Facebook
            </p>
            <p>
              <FaInstagram /> Instagram
            </p>
          </div>

          <div style={{ flex: 1 }}>
            <h5>HỖ TRỢ KHÁCH HÀNG</h5>
            <p>Chính sách đổi hàng và bảo hành</p>
            <p>Chính sách thành viên</p>
            <p>Chính sách ưu đãi sinh nhật</p>
            <p>Chính sách bảo mật</p>
            <p>Chính sách giao hàng</p>
          </div>

          <div style={{ flex: 1 }}>
            <h5>Về xmark</h5>
            <p>Câu chuyện thương hiệu</p>
            <p>Giá trị cốt lõi</p>
            <p>Trách nhiệm cộng đồng</p>
            <p>Tìm hiểu nguyên liệu</p>
          </div>
        </footer>
      )}
      {mp && (
        <footer
          style={{
            padding: "30px 20%",
            background: "#6EB566",
            color: "white",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "70px" }} className="font-xmark">
              xmark
            </h1>
            <p>
              <FaPhone /> Tổng đài CSKH: 0829982028
            </p>
            <p>
              <FaEnvelope /> Email: cskh@xmark.com
            </p>
            <h6>Theo dõi xmark</h6>
            <p>
              <FaFacebook /> Facebook
            </p>
            <p>
              <FaInstagram /> Instagram
            </p>
          </div>
        </footer>
      )}
      {mb && (
        <footer
          style={{
            padding: "30px 20%",
            background: "#6EB566",
            color: "white",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "70px" }} className="font-xmark">
              xmark
            </h1>
            <p>
              <FaPhone /> Tổng đài CSKH: 0829982028
            </p>
            <p>
              <FaEnvelope /> Email: cskh@xmark.com
            </p>
            <h6>Theo dõi xmark</h6>
            <p>
              <FaFacebook /> Facebook
            </p>
            <p>
              <FaInstagram /> Instagram
            </p>
          </div>
        </footer>
      )}
    </>
  );
}
