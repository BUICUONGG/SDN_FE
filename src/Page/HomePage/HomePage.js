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

        <ChatBox />
    </>
  );
}
