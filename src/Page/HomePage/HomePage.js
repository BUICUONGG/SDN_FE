import React from "react";
import ListIntro from "../ListIntroProduct/ListIntro";
import DailyDeals from "../ListIntroProduct/DailyDeal";
import SearchCarousel from "../ListIntroProduct/SearchCarousel";
import ProductHot from "../ListIntroProduct/ProductHot";
import img1 from "../../img/EXE/14.png";
import img2 from "../../img/EXE/15.png";
import img3 from "../../img/EXE/16.png";
import img4 from "../../img/EXE/17.png";
import ChatBox from "../../Components/ChatBox/ChatBox";

export default function HomePage() {

  return (
    <>
      {/* content giam gia */}
      <div
        style={{ marginTop: "10%", width: "100%", backgroundColor: "#EAFEBE" }}
      >
        <div
          style={{
            padding: "1% 10%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{
              borderRight: "2px solid black",
              fontSize: "24px",
              fontWeight: "700",
              padding: "1% 3%",
            }}
          >
            Ưu đãi 50% cho đơn hàng đầu tiên
          </span>
          <span
            style={{
              paddingLeft: "2%",
            }}
          >
            Nhập mã:{" "}
            <span
              style={{
                padding: "0 1%",
                color: "white",
                backgroundColor: "#32D74B",
              }}
            >
              helo
            </span>{" "}
            để nhận ngay giảm 50% khi đặt hàng lần đầu tiên. Miễn phí vận chuyển
          </span>
        </div>
      </div>

        <div
          style={{
            padding: "0 10%",
          }}
        >
          <ListIntro />
        </div>

        <div
          style={{
            margin: "40px 0",
            padding: "0 10%",
          }}
        >
          <DailyDeals />
        </div>

        <div>
          <SearchCarousel />
        </div>
        <div
          style={{
            margin: "40px 0",
            textAlign: "center",
          }}
        >
          <ProductHot />
        </div>

        {/* casel info */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 10%" , margin: '5% 0'}}>
          <div style={{ width: '50%', position: 'relative' , padding: '0 3%'}}>
            <div style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, #E3FDE0 88%, #DFFCDC 100%)",
              height: '50vh',
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              padding: '15% 5% 0 5%',
             }}>
              <h3 style={{fontSize: '36px', color: '#0C4006'}}>Thời Trang Nam</h3>
              <p style={{ fontSize: '16px', fontWeight: '400', marginLeft: '5%', color: '#0C4006'}}>Phong cách mạnh mẽ & lịch lãm</p>
              <button style={{
                padding: '3% 7%',
                backgroundColor: '#104E04',
                border: 'none',
                borderRadius: '20px',
                color: 'white',
                fontSize: '10px',
                marginTop: '20%',
              }}>
                <span>TÌM HIỂU THÊM</span>
              </button>
            </div>
            <img style={{width: '100%', position: 'absolute', bottom: '0', right: '-20%'}} src={img1} alt="Thời Trang Nam" />
          </div>
          <div style={{ width: '50%', position: 'relative' , padding: '0 3%'}}>
            <div style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, #E3FDE0 88%, #DFFCDC 100%)",
              height: '50vh',
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              padding: '15% 5% 0 5%',
              textAlign: 'right',
             }}>
              <h3 style={{fontSize: '36px', color: '#0C4006'}}>Thời Trang Nữ</h3>
              <p style={{ fontSize: '16px', fontWeight: '400', marginRight: '5%', color: '#0C4006'}}>Thời trang tinh tế & cá tính</p>
              <button style={{
                padding: '3% 7%',
                backgroundColor: '#104E04',
                border: 'none',
                borderRadius: '20px',
                color: 'white',
                fontSize: '10px',
                marginTop: '20%',
              }}>
                <span>TÌM HIỂU THÊM</span>
              </button>
            </div>
            <img style={{width: '120%', position: 'absolute', bottom: '0', left: '-35%'}} src={img2} alt="Thời Trang Nữ" />
          </div>
        </div>

        <h1 style={{textAlign: 'center', fontSize: '32px', color: '#0C4006'}}>Tin thời trang</h1>
        {/* info fashion */}
        <div style={{ display: "flex", justifyContent: "space-between", margin:'3% 0 5% 0'}}>
          <div style={{ width: '50%' }}>
            <img src={img3} alt="Fashion article about black color combinations" style={{width: '100%', marginLeft: '7%'}}/>
            <p style={{ color: '#0C4006', fontSize: '24px', padding: '0 5% 0 12%'}}>Màu đen hợp với màu gì? 9 màu phối với màu đen phù hợp nhất</p>
            <p style={{ color: '#0C4006', fontSize: '12px', padding: '0 5% 0 12%'}}>Từ những bộ suit lịch lãm cho đến trang phục thường ngày, màu đen luôn là lựa chọn đầy phong cách cho phái mạnh. Tuy nhiên, không phải ai cũng thực sự biết rõ màu đen hợp với màu gì để phối đồ ...</p>
          </div>
          <div style={{ width: '50%' }}>
            <img src={img4} alt="Fashion article about blazer and jeans" style={{width: '100%'}}/>
            <p style={{ color: '#0C4006', fontSize: '24px', padding: '0 4%'}}>Hướng dẫn phối áo blazer và quần jeans nam thanh lịch</p>
            <p style={{ color: '#0C4006', fontSize: '12px', padding: '0 10% 0 4%'}}>Blazer và quần jeans - hai món đồ tưởng chừng như đối lập nhưng lại tạo nên một sự kết hợp đầy thanh lịch và cuốn hút. Khi biết cách phối hai item này, bạn có thể dễ dàng tạo dựng một phong cách vừa ...</p>
          </div>
        </div>
        <ChatBox />
    </>
  );
}
