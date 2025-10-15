import React, { use, useEffect, useRef, useState } from "react";
import "./styles.css";
import { FaGlobe, FaShoppingCart } from "react-icons/fa";
import logo from "../../img/34.png";
import logo1 from "../../img/carusel.jpg";
import CarouselIntro from "./CarouselIntro";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import HotProduct from "./HotProduct";
import dv1 from "../../img/EXE/10.png";
import dv2 from "../../img/EXE/11.png";
import dv3 from "../../img/EXE/12.png";
import FooterPage from "../../Components/Footer/FooterPage";
import { appService } from "../../service/appService";


export default function InfoUser() {
  const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const pageSize = 0;
    const navigate = useNavigate();
    const carouselRef = useRef();
  
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await appService.getAllProduct(0, pageSize);
        setProducts(response.data.metadata.metadata);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
  
    console.log(products);
  
    useEffect(() => {
      fetchProducts();
    }, []);

  const nagivate = useNavigate();
  const data = [
    {
      key: 1,
      stt: "Áo thun nữ",
    },
    {
      key: 2,
      stt: "Quần dài công sở",
    },
    {
      key: 3,
      stt: "áo khoác",
    },
  ];
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

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Hiệu ứng kéo dài 1 giây
  }, []);

  const onClick = () => {
    nagivate("/home");
    window.location.reload();
  };

  return (
    <div style={{ backgroundColor: "#f8f8f8" }}>
      {/* Header */}
      <div className="header-intro">
        <div className="header-container">
          <span className="font-xmark">xmark</span>
          {(dt || ip) && (
            <div className="header-right">
            
              <button onClick={onClick} className="menu-button">
                Tới trang mua sắm
              </button>
            </div>
          )}
          {mb && (
            <div className="header-right">
              <button
                onClick={onClick}
                className="menu-button"
                style={{
                  border: "none",
                  color: "white",
                  padding: "5px 5px",
                  borderRadius: "30px",
                  fontSize: "12px",
                }}
              >
                Tới trang mua sắm
              </button>
            </div>
          )}
          {mp && (
            <div className="header-right">
              <button onClick={onClick} className="menu-button">
                Tới trang mua sắm
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Intro */}
      <div className="intro-page">
        <div className="container-intro">
          {dt && (
            <h1 className="allura-regular" style={{ fontSize: "90px" }}>
              Thời trang vượt thời gian
            </h1>
          )}
          {ip && (
            <h1 className="allura-regular" style={{ fontSize: "70px" }}>
              Thời trang vượt thời gian
            </h1>
          )}
          {mp && (
            <h1 className="allura-regular" style={{ fontSize: "50px" }}>
              Thời trang vượt thời gian
            </h1>
          )}

          {mb && (
            <h1 className="allura-regular" style={{ fontSize: "30px" }}>
              Thời trang vượt thời gian
            </h1>
          )}

          {dt && (
            <span
              style={{
                letterSpacing: "1px",
                fontSize: "16px",
                fontWeight: "300",
              }}
            >
              Khám phá xu hướng thời trang mới nhất từ xmark. Nâng tầm tủ đồ của
              bạn với những bộ <br /> sưu tập ấn tượng của chúng tôi
            </span>
          )}

          {ip && (
            <span
              style={{
                letterSpacing: "1px",
                fontSize: "14px",
                fontWeight: "300",
              }}
            >
              Khám phá xu hướng thời trang mới nhất từ xmark. Nâng tầm tủ đồ của
              bạn với những bộ <br /> sưu tập ấn tượng của chúng tôi
            </span>
          )}

          {mp && (
            <span
              style={{
                letterSpacing: "1px",
                fontSize: "12px",
                fontWeight: "300",
              }}
            >
              Khám phá xu hướng thời trang mới nhất từ xmark. Nâng tầm tủ đồ của
              bạn với những bộ sưu tập ấn tượng của chúng tôi
            </span>
          )}

          {mb && (
            <span
              style={{
                letterSpacing: "1px",
                fontSize: "10px",
                fontWeight: "300",
              }}
            >
              Khám phá xu hướng thời trang mới nhất từ xmark. Nâng tầm tủ đồ của
              bạn với những bộ sưu tập ấn tượng của chúng tôi
            </span>
          )}

          {dt && (
            <div
              style={{
                background: "white",
                width: "50%",
                borderRadius: "60px",
                color: "black",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 13px",
                marginTop: "7%",
                marginBottom: "1.5%",
              }}
            >
              <span style={{ marginLeft: "5%", opacity: 0.6 }}>Nhập từ khoá tìm kiếm</span>
              <div>
                <img style={{ width: "20%" }} src={logo} alt="img" />
                <button
                  style={{
                    border: "none",
                    padding: "10px 25px",
                    background: "rgb(110,181,102)",
                    color: "white",
                    borderRadius: "30px",
                    letterSpacing: "3px",
                    marginLeft: "18px",
                  }}
                >
                  Tìm kiếm
                </button>
              </div>
            </div>
          )}
          {dt && (
            <div
              style={{
                marginLeft: "2%",
                marginBottom: "10%",
              }}
            >
              <span>Từ khóa nổi bật: </span>
              {/* handle map */}
              {data.map((item) => (
                <span
                  key={item.id} // Always include a unique key when mapping elements
                  style={{
                    padding: "2px 1%",
                    border: "1px solid white",
                    borderRadius: "20px",
                    margin: "0 1%",
                  }}
                >
                  {item.stt}
                </span>
              ))}
            </div>
          )}

          {ip && (
            <div
              style={{
                background: "white",
                width: "50%",
                borderRadius: "60px",
                color: "black",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 13px",
                marginTop: "7%",
                marginBottom: "1.5%",
              }}
            >
              <span style={{ marginLeft: "5%" }}>Áo thun nam</span>
              <div>
                <button
                  style={{
                    border: "none",
                    padding: "10px 25px",
                    background: "rgb(110,181,102)",
                    color: "white",
                    borderRadius: "30px",
                    letterSpacing: "3px",
                    marginLeft: "18px",
                  }}
                >
                  Tìm kiếm
                </button>
              </div>
            </div>
          )}
          {ip && (
            <div
              style={{
                marginLeft: "2%",
                marginBottom: "10%",
              }}
            >
              <span>Từ khóa nổi bật: </span>
              {/* handle map */}
              {data.map((item) => (
                <span
                  key={item.id} // Always include a unique key when mapping elements
                  style={{
                    padding: "2px 1%",
                    border: "1px solid white",
                    borderRadius: "20px",
                    margin: "0 1%",
                    fontSize: "14px",
                  }}
                >
                  {item.stt}
                </span>
              ))}
            </div>
          )}

          {mp && (
            <div
              style={{
                background: "white",
                width: "50%",
                borderRadius: "60px",
                color: "black",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 13px",
                marginTop: "7%",
                marginBottom: "1.5%",
              }}
            >
              <span style={{ marginLeft: "5%", fontSize: "12px" }}>
                Áo thun nam
              </span>
              <div>
                <button
                  style={{
                    border: "none",
                    padding: "5px 5px",
                    background: "rgb(110,181,102)",
                    color: "white",
                    borderRadius: "30px",
                    letterSpacing: "3px",
                    marginLeft: "18px",
                    fontSize: "12px",
                  }}
                >
                  Tìm kiếm
                </button>
              </div>
            </div>
          )}
          {mp && (
            <div
              style={{
                marginLeft: "2%",
                marginBottom: "10%",
              }}
            >
              <span style={{ fontSize: "12px" }}>Từ khóa nổi bật: </span>
              {/* handle map */}
              {data.map((item) => (
                <span
                  key={item.id} // Always include a unique key when mapping elements
                  style={{
                    padding: "2px 1%",
                    border: "1px solid white",
                    borderRadius: "20px",
                    margin: "0 1%",
                    fontSize: "12px",
                  }}
                >
                  {item.stt}
                </span>
              ))}
            </div>
          )}

          {mb && (
            <div
              style={{
                background: "white",
                width: "100%",
                borderRadius: "60px",
                color: "black",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 13px",
                marginTop: "7%",
                marginBottom: "1.5%",
              }}
            >
              <span style={{ marginLeft: "5%", fontSize: "12px" }}>
                Áo thun nam
              </span>
              <div>
                <button
                  style={{
                    border: "none",
                    padding: "5px 5px",
                    background: "rgb(110,181,102)",
                    color: "white",
                    borderRadius: "30px",
                    letterSpacing: "3px",
                    marginLeft: "18px",
                    fontSize: "12px",
                  }}
                >
                  Tìm kiếm
                </button>
              </div>
            </div>
          )}
          {mb && (
            <div
              style={{
                marginLeft: "2%",
                marginBottom: "10%",
              }}
            >
              <span style={{ fontSize: "12px" }}>Từ khóa nổi bật: </span>
              {/* handle map */}
              {data.map((item) => (
                <span
                  key={item.id} // Always include a unique key when mapping elements
                  style={{
                    padding: "2px 1%",
                    border: "1px solid white",
                    borderRadius: "20px",
                    margin: "0 1%",
                    fontSize: "12px",
                  }}
                >
                  {item.stt}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Banner */}
      <div className="banner-intro" style={{ padding: "6% 5%" }}>
        <CarouselIntro />
      </div>

      {/* sản phẩm nội bật */}
      <div>
        <h1
          style={{
            textAlign: "center",
            fontWeight: "900",
            fontFamily: "serif",
          }}
        >
          Thương Hiệu Nổi Bật
        </h1>
        <p
          style={{
            color: "black",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          Hơn 50.000+ món đồ second-hand đến từ các thương hiệu nổi tiếng đang
          chờ bạn!
        </p>
        <HotProduct />
      </div>

      {/* Special Offers */}
      {dt && (
        <div
          className="officer-intro"
          style={{
            padding: "3% 5%",
            display: "flex",
          }}
        >
          <div
            style={{
              width: "42%",
            }}
          >
            <h2 style={{ fontSize: "60px" }}>
              Lợi ích khi mua & bán đồ second-hand
            </h2>
            <div
              style={{
                marginLeft: "15%",
              }}
            >
              <h2 style={{ margin: "10% 0" }}>Đối với người mua</h2>
              <p>Tiếp cận nhiều món đồ đẹp, giá tốt.</p>
              <p>Mỗi món đồ đều có câu chuyện riêng, tạo nên sự đặc biệt.</p>
              <p>Góp phần bảo vệ môi trường bằng cách tái sử dụng.</p>
              <h2 style={{ margin: "10% 0" }}>Đối với người bán</h2>
              <p>Bán lại những món đồ không dùng nữa, kiếm thêm thu nhập.</p>
              <p>Đơn giản, nhanh chóng, không mất phí đăng tin.</p>
              <p>Chia sẻ phong cách cá nhân thông qua từng món đồ.</p>
            </div>
          </div>
        </div>
      )}
      {ip && (
        <div
          className="officer-intro"
          style={{
            padding: "3% 5%",
            display: "flex",
          }}
        >
          <div
            style={{
              width: "42%",
            }}
          >
            <h2 style={{ fontSize: "40px" }}>
              Lợi ích khi mua & bán đồ second-hand
            </h2>
            <div
              style={{
                marginLeft: "15%",
                fontSize: "14px",
              }}
            >
              <h2
                style={{ margin: "10% 0", fontSize: "30px", fontWeight: "500" }}
              >
                Đối với người mua
              </h2>
              <p>Tiếp cận nhiều món đồ đẹp, giá tốt.</p>
              <p>Mỗi món đồ đều có câu chuyện riêng, tạo nên sự đặc biệt.</p>
              <p>Góp phần bảo vệ môi trường bằng cách tái sử dụng.</p>
              <h2
                style={{ margin: "10% 0", fontSize: "30px", fontWeight: "500" }}
              >
                Đối với người bán
              </h2>
              <p>Bán lại những món đồ không dùng nữa, kiếm thêm thu nhập.</p>
              <p>Đơn giản, nhanh chóng, không mất phí đăng tin.</p>
              <p>Chia sẻ phong cách cá nhân thông qua từng món đồ.</p>
            </div>
          </div>
        </div>
      )}
      {mp && (
        <div
          className="officer-intro"
          style={{
            padding: "3% 5%",
            display: "flex",
          }}
        >
          <div
            style={{
              width: "42%",
            }}
          >
            <h2 style={{ fontSize: "30px" }}>
              Lợi ích khi mua & bán đồ second-hand
            </h2>
            <div
              style={{
                marginLeft: "15%",
                fontSize: "12px",
              }}
            >
              <h2
                style={{ margin: "10% 0", fontSize: "20px", fontWeight: "500" }}
              >
                Đối với người mua
              </h2>
              <p>Tiếp cận nhiều món đồ đẹp, giá tốt.</p>
              <p>Mỗi món đồ đều có câu chuyện riêng, tạo nên sự đặc biệt.</p>
              <p>Góp phần bảo vệ môi trường bằng cách tái sử dụng.</p>
              <h2
                style={{ margin: "10% 0", fontSize: "20px", fontWeight: "500" }}
              >
                Đối với người bán
              </h2>
              <p>Bán lại những món đồ không dùng nữa, kiếm thêm thu nhập.</p>
              <p>Đơn giản, nhanh chóng, không mất phí đăng tin.</p>
              <p>Chia sẻ phong cách cá nhân thông qua từng món đồ.</p>
            </div>
          </div>
        </div>
      )}
      {mb && (
        <div
          className="officer-intro"
          style={{
            padding: "3% 5%",
            display: "flex",
          }}
        >
          <div
            style={{
              width: "100%",
            }}
          >
            <h2 style={{ fontSize: "30px" }}>
              Lợi ích khi mua & bán đồ second-hand
            </h2>
            <div
              style={{
                marginLeft: "15%",
                fontSize: "12px",
              }}
            >
              <h2
                style={{ margin: "10% 0", fontSize: "20px", fontWeight: "500" }}
              >
                Đối với người mua
              </h2>
              <p>Tiếp cận nhiều món đồ đẹp, giá tốt.</p>
              <p>Mỗi món đồ đều có câu chuyện riêng, tạo nên sự đặc biệt.</p>
              <p>Góp phần bảo vệ môi trường bằng cách tái sử dụng.</p>
              <h2
                style={{ margin: "10% 0", fontSize: "20px", fontWeight: "500" }}
              >
                Đối với người bán
              </h2>
              <p>Bán lại những món đồ không dùng nữa, kiếm thêm thu nhập.</p>
              <p>Đơn giản, nhanh chóng, không mất phí đăng tin.</p>
              <p>Chia sẻ phong cách cá nhân thông qua từng món đồ.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tầm nhìn */}
      {dt && (
        <div
          className="officer-intro2"
          style={{
            padding: "4% 5%",
            display: "flex",
          }}
        >
          <img style={{ width: "58%" }} src={logo1} alt="" />
          <div
            style={{
              width: "42%",
              textAlign: "center",
              padding: "10% 0",
              letterSpacing: "5px",
            }}
          >
            <h1 style={{ fontSize: "40px", color: "#1B5E20" }}>
              Chương trình{" "}
            </h1>
            <h1
              style={{ fontSize: "42px", color: "#1B5E20", fontWeight: "900" }}
            >
              KHUYẾN MÃI{" "}
            </h1>
            <button
              style={{
                marginTop: "40%",
                padding: "10px 45px",
                background: "#2E7D32",
                border: "none",
                color: "white",
                borderRadius: "50px",
                fontSize: "30px",
              }}
            >
              Mua sắm ngay
            </button>
          </div>
        </div>
      )}
      {ip && (
        <div
          className="officer-intro2"
          style={{
            padding: "4% 5%",
            display: "flex",
          }}
        >
          <img style={{ width: "58%" }} src={logo1} alt="" />
          <div
            style={{
              width: "42%",
              textAlign: "center",
              padding: "10% 0",
              letterSpacing: "5px",
            }}
          >
            <h1 style={{ fontSize: "36px", color: "#1B5E20" }}>
              Chương trình{" "}
            </h1>
            <h1
              style={{ fontSize: "38px", color: "#1B5E20", fontWeight: "900" }}
            >
              KHUYẾN MÃI{" "}
            </h1>
            <button
              style={{
                marginTop: "40%",
                padding: "5px 30px",
                background: "#2E7D32",
                border: "none",
                color: "white",
                borderRadius: "50px",
                fontSize: "26px",
              }}
            >
              Mua sắm ngay
            </button>
          </div>
        </div>
      )}
      {mp && (
        <div
          className="officer-intro2"
          style={{
            padding: "4% 5%",
            display: "flex",
          }}
        >
          <img style={{ width: "58%" }} src={logo1} alt="" />
          <div
            style={{
              width: "42%",
              textAlign: "center",
              padding: "10% 0",
              letterSpacing: "5px",
            }}
          >
            <h1 style={{ fontSize: "30px", color: "#1B5E20" }}>
              Chương trình{" "}
            </h1>
            <h1
              style={{ fontSize: "32px", color: "#1B5E20", fontWeight: "900" }}
            >
              KHUYẾN MÃI{" "}
            </h1>
            <button
              style={{
                marginTop: "40%",
                padding: "5px 20px",
                background: "#2E7D32",
                border: "none",
                color: "white",
                borderRadius: "50px",
                fontSize: "20px",
              }}
            >
              Mua sắm ngay
            </button>
          </div>
        </div>
      )}
      {mb && (
        <div
          className="officer-intro2"
          style={{
            padding: "4% 5%",
            display: "flex",
          }}
        >
          <img style={{ width: "58%" }} src={logo1} alt="" />
          <div
            style={{
              width: "42%",
              textAlign: "center",
              padding: "10% 0",
              letterSpacing: "5px",
            }}
          >
            <h1 style={{ fontSize: "14px", color: "#1B5E20" }}>
              Chương trình{" "}
            </h1>
            <h1
              style={{ fontSize: "16px", color: "#1B5E20", fontWeight: "900" }}
            >
              KHUYẾN MÃI{" "}
            </h1>
            <button
              style={{
                marginTop: "40%",
                padding: "5px 20px",
                background: "#2E7D32",
                border: "none",
                color: "white",
                borderRadius: "50px",
                fontSize: "12px",
              }}
            >
              Mua sắm ngay
            </button>
          </div>
        </div>
      )}

      {/* Guest */}
      <div
        className="guest-intro"
        data-aos="fade-in"
        style={{ padding: "7% 0%" }}
      >
        <h1
          style={{
            fontSize: "55px",
            textAlign: "center",
            color: "#1C7E11",
            marginBottom: "4%",
          }}
        >
          DỊCH VỤ CUNG CẤP
        </h1>

        <div
          style={{ padding: "5% 5%", display: "flex" }}
          className="guest-intro-container"
        >
          <div
            style={{
              width: "30%",
              textAlign: "center",
              background: "#D9D9D9",
              borderRadius: "20px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              margin: "0 5%",
              height: "100%",
            }}
          >
            <div
              style={{
                backgroundImage: `url(${dv1})`,
                backgroundSize: "230%",
                height: "300px",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: "20px",
                marginBottom: "5%",
              }}
            ></div>
            <p
              style={{ fontSize: "20px", color: "#1B5E20", fontWeight: "700" }}
            >
              Mua bán đồ second-hand
            </p>
            <p style={{ padding: "3% 15%", fontSize: "12px" }}>
              Mua sắm và trao đổi quần áo, phụ kiện second-hand chất lượng cao
              với mức giá hợp lý.
            </p>
          </div>
          <div
            style={{
              width: "30%",
              textAlign: "center",
              background: "#D9D9D9",
              borderRadius: "20px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              margin: "0 5%",
            }}
          >
            <div
              style={{
                backgroundImage: `url(${dv2})`,
                backgroundSize: "330%",
                height: "300px",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: "20px",
                marginBottom: "5%",
              }}
            ></div>
            <p
              style={{ fontSize: "20px", color: "#1B5E20", fontWeight: "700" }}
            >
              Câu chuyện của món đồ
            </p>
            <p style={{ padding: "3% 15%", fontSize: "12px" }}>
              Khám phá câu chuyện đằng sau từng món đồ, từ nguồn gốc, phong cách
              cho đến kỷ niệm của chủ cũ.
            </p>
          </div>

          <div
            style={{
              width: "30%",
              textAlign: "center",
              background: "#D9D9D9",
              borderRadius: "20px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              margin: "0 5%",
            }}
          >
            <div
              style={{
                backgroundImage: `url(${dv3})`,
                backgroundSize: "230%",
                height: "300px",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: "20px",
                marginBottom: "5%",
              }}
            ></div>
            <p
              style={{ fontSize: "20px", color: "#1B5E20", fontWeight: "700" }}
            >
              Gợi ý phối đồ
            </p>
            <p style={{ padding: "3% 15%", fontSize: "12px" }}>
              Gợi ý cách kết hợp quần áo, phụ kiện second-hand để tạo nên những
              outfit thời thượng và cá tính.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <FooterPage />
    </div>
  );
}
