import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import "./admincp.css";
import { BsArrowUp, BsBookmark } from "react-icons/bs";
import { BsArrowDown } from "react-icons/bs";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { HiMiniUsers } from "react-icons/hi2";
import { BsCartFill } from "react-icons/bs";
import { BiDollar } from "react-icons/bi";
import { RiArrowDownBoxFill } from "react-icons/ri";
import { RiArrowUpBoxFill } from "react-icons/ri";
import { CiBank } from "react-icons/ci";
import { CiMoneyBill } from "react-icons/ci";
import { Flex, Progress } from "antd";
import { appService } from "../../../service/appService";
import { tiktokService } from "../../../service/tiktokService";
import { IoEyeSharp } from "react-icons/io5";
import { AiFillLike } from "react-icons/ai";
import { LiaComment } from "react-icons/lia";
import { IoIosHeartEmpty, IoIosShareAlt } from "react-icons/io";
import logo from "../../../img/xmark-high-resolution-logo.png";
import h1 from "../../../img/dashboardAd/ee.jpg";
import h2 from "../../../img/dashboardAd/7bfe72085865d13b8874.jpg";
import h3 from "../../../img/dashboardAd/7e9f3defdf8256dc0f93.jpg";
import h4 from "../../../img/dashboardAd/af1e82efa88221dc7893.jpg";
import h5 from "../../../img/dashboardAd/b997ad274c4ac5149c5b.jpg";
import h6 from "../../../img/dashboardAd/fa202757c43a4d64142b.jpg";
import { FaRegCommentDots } from "react-icons/fa";
import axios from "axios";

const datatt = [
  { name: "14 tháng 7", truyCap: 5 },
  { name: "15 tháng 7", truyCap: 12 },
  { name: "16 tháng 7", truyCap: 2 },
  { name: "17 tháng 7", truyCap: 2 },
  { name: "18 tháng 7", truyCap: 10 },
  { name: "19 tháng 7", truyCap: 13 },
  { name: "20 tháng 7", truyCap: 8 },
];

const allData = {
  "6months": [
    { name: "Tháng 01", truyCap: 4000, doanhThu: 2400 },
    { name: "Tháng 02", truyCap: 3000, doanhThu: 1398 },
    { name: "Tháng 03", truyCap: 2000, doanhThu: 9800 },
    { name: "Tháng 04", truyCap: 2780, doanhThu: 3908 },
    { name: "Tháng 05", truyCap: 1890, doanhThu: 4800 },
    { name: "Tháng 06", truyCap: 2390, doanhThu: 3800 },
  ],
  "12months": [
    { name: "Tháng 01", truyCap: 4000, doanhThu: 2400 },
    { name: "Tháng 02", truyCap: 3000, doanhThu: 1398 },
    { name: "Tháng 03", truyCap: 2000, doanhThu: 9800 },
    { name: "Tháng 04", truyCap: 2780, doanhThu: 3908 },
    { name: "Tháng 05", truyCap: 1890, doanhThu: 4800 },
    { name: "Tháng 06", truyCap: 2390, doanhThu: 3800 },
    { name: "Tháng 07", truyCap: 3490, doanhThu: 4300 },
    { name: "Tháng 08", truyCap: 3000, doanhThu: 3600 },
    { name: "Tháng 09", truyCap: 2500, doanhThu: 4000 },
    { name: "Tháng 10", truyCap: 2700, doanhThu: 4200 },
    { name: "Tháng 11", truyCap: 3200, doanhThu: 4100 },
    { name: "Tháng 12", truyCap: 3600, doanhThu: 4700 },
  ],
  "2years": [
    { name: "Năm 1", truyCap: 18000, doanhThu: 10400 },
    { name: "Năm 2", truyCap: 22000, doanhThu: 14000 },
  ],
};

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("6months");
  const [totalSeller, setTotalSeller] = useState([]);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videos1, setVideos1] = useState([]);
  const [loading, setLoading] = useState(true); // Optional: loading state
  const [error, setError] = useState(null);

  const TIKTOK_REFRESH_TOKEN =
    "rft.QujG9VNvTCVS2ZTrUAz4sPJjXzq0BXkwM4WBwQ2YVrFJ0bU8Q0DTDmKuP1ZK!6463.va";
  const [tiktokData, setTiktokData] = useState(null);

  useEffect(() => {
    async function fetchTikTokData() {
      try {
        // Bước 1: Refresh token
        const refreshRes = await tiktokService.refreshToken(
          TIKTOK_REFRESH_TOKEN
        );
        const newAccessToken = refreshRes.data.access_token;
        const openId = refreshRes.data.open_id;

        // Bước 2: Gọi API lấy thông tin người dùng TikTok
        const userInfoRes = await tiktokService.getUserInfo(
          newAccessToken,
          openId
        );
        setTiktokData(userInfoRes.data);

        console.log("TikTok User Info:", userInfoRes.data);
      } catch (error) {
        console.error("TikTok integration failed", error);
      }
    }

    fetchTikTokData();
  }, []);

  useEffect(() => {
    appService
      .getAllSellerAD()
      .then((res) => {
        setTotalSeller(res.data.metadata);
      })
      .catch((err) => {
        console.error("Error fetching stores:", err);
      });
  }, []);

  useEffect(() => {
    appService
      .getAllOrderAD()
      .then((res) => {
        setData(res.data.metadata);
      })
      .catch((err) => {
        console.error("Error fetching stores:", err);
      });
  }, []);


  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.post(
          "https://tiktok-service.truong51972.id.vn/api/get_user_info",    
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API response:", response.data.data.user);
        setVideos(response.data.data.user); // Cập nhật dữ liệu
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setError("Không thể lấy dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.post(
          "https://tiktok-service.truong51972.id.vn/api/get_videos_info", 
          {
            from_date: "2025-07-23T00:00:00",
            to_date: "2025-07-23T23:59:59.999999"
          },   
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API response:", response.data[0]);
        setVideos1(response.data[0]); // Cập nhật dữ liệu
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setError("Không thể lấy dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  console.log(videos1);

  useEffect(() => {
    appService
      .getAllUserAD()
      .then((res) => {
        setData1(res.data.metadata);
      })
      .catch((err) => {
        console.error("Error fetching stores:", err);
      });
  }, []);

  const handleChangeRange = (e) => {
    setTimeRange(e.target.value);
  };
  return (
    <div className="dashboard-container">
      {/* Header Boxes */}
      <h3
        style={{
          marginBottom: "2%",
        }}
      >
        Thống Kê
      </h3>
      <div className="stats-boxes">
        <div className="stat-card">
          <HiOutlineBuildingStorefront
            style={{
              height: "37px",
              width: "37px",
              color: "#43903A",
            }}
          />
          <p
            style={{
              margin: "0",
              fontSize: "15px",
            }}
          >
            Người bán
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              {totalSeller.totalSellers}
            </span>
            <span
              style={{
                color: "green",
                fontSize: "12px",
                marginLeft: "5px",
                padding: "2px 5px",
                backgroundColor: "#e6f7ff",
                borderRadius: "5px",
              }}
            >
              <BsArrowUp /> 7.34%
            </span>
          </div>
        </div>
        <div className="stat-card">
          <HiMiniUsers
            style={{
              height: "37px",
              width: "37px",
              color: "#43903A",
            }}
          />
          <p
            style={{
              margin: "0",
              fontSize: "15px",
            }}
          >
            Người dùng
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              {data1.total}
            </span>
            <span
              style={{
                color: "green",
                fontSize: "12px",
                marginLeft: "5px",
                padding: "2px 5px",
                backgroundColor: "#e6f7ff",
                borderRadius: "5px",
              }}
            >
              <BsArrowUp /> 7.34%
            </span>
          </div>
        </div>
        <div className="stat-card">
          <BsCartFill
            style={{
              height: "37px",
              width: "37px",
              color: "#43903A",
            }}
          />
          <p
            style={{
              margin: "0",
              fontSize: "15px",
            }}
          >
            Đơn hàng
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              {data.totalOrders}
            </span>
            <span
              style={{
                color: "green",
                fontSize: "12px",
                marginLeft: "5px",
                padding: "2px 5px",
                backgroundColor: "#e6f7ff",
                borderRadius: "5px",
              }}
            >
              <BsArrowUp /> 7.34%
            </span>
          </div>
        </div>
        <div className="stat-card">
          <BiDollar
            style={{
              height: "37px",
              width: "37px",
              color: "#43903A",
            }}
          />
          <p
            style={{
              margin: "0",
              fontSize: "15px",
            }}
          >
            Doanh thu
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              {data.totalPrice?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
            <span
              style={{
                color: "red",
                fontSize: "12px",
                marginLeft: "5px",
                padding: "2px 5px",
                backgroundColor: "#e6f7ff",
                borderRadius: "5px",
              }}
            >
              <BsArrowDown /> 7.34%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Chart */}
        <div className="chart-box">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5%",
            }}
            className="chart-header"
          >
            <span
              style={{
                fontSize: "16px",
                color: "#6EB566",
                padding: "5px 10px",
                borderRadius: "10px",
                background:
                  "linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(227, 253, 224, 0.5) 12%, rgba(223, 252, 220, 0.6) 100%)",
              }}
            >
              Phân tích doanh số
            </span>
            <select
              style={{
                outline: "none",
                marginTop: "5%",
              }}
              value={timeRange}
              onChange={handleChangeRange}
              className="range-select"
            >
              <option value="6months">6 tháng</option>
              <option value="12months">12 tháng</option>
              <option value="2years">2 năm</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={allData[timeRange]}>
              <Line
                type="monotone"
                dataKey="truyCap"
                stroke="#FF4C4C"
                name="Lượt truy cập"
              />
              <Line
                type="monotone"
                dataKey="doanhThu"
                stroke="#00C49F"
                name="Doanh thu"
              />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Wallet Box */}
        <div
          style={{
            width: "30%",
          }}
        >
          <div className="wallet-box">
            <p
              style={{
                fontSize: "24px",
                margin: "0",
                fontWeight: "600",
              }}
            >
              {data.totalPrice?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
            <p
              style={{
                fontSize: "20px",
                margin: "0",
                marginBottom: "10%",
              }}
            >
              Ví của sàn
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              className="wallet-transactions"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <RiArrowDownBoxFill
                  style={{
                    color: "#046BDA",
                    fontSize: "52px",
                  }}
                />
                <div>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "16px",
                      color: "white",
                    }}
                  >
                    {data.totalPrice?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "14px",
                      color: "#467341",
                    }}
                  >
                    Nguồn thu
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <RiArrowUpBoxFill
                  style={{
                    color: "#D7686B",
                    fontSize: "52px",
                  }}
                />
                <div>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "16px",
                      color: "white",
                    }}
                  >
                    0
                  </p>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "14px",
                      color: "#467341",
                    }}
                  >
                    Nguồn chi
                  </p>
                </div>
              </div>
            </div>

            <div className="wallet-buttons">
              <button className="btn-send">Gửi</button>
              <button className="btn-receive">Nhận</button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              backgroundColor: "#CAF7C6",
              borderRadius: "10px",
              padding: "5%",
              marginTop: "10px",
            }}
          >
            <div className="summary-row-db">
              <p
                style={{
                  color: "#383838",
                  fontSize: "14px",
                  fontWeight: "600",
                  margin: "0",
                }}
              >
                Tài sản:
              </p>
              <CiBank
                style={{
                  width: "36px",
                  height: "36px",
                  color: "#0451AB",
                }}
              />
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  margin: "0",
                }}
              >
                {data.totalPrice?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "400",
                  margin: "0",
                }}
              >
                Đạt được <span>70%</span>
              </p>
              <Flex vertical gap="small" style={{ width: 180 }}>
                <Progress
                  percent={70}
                  percentPosition={{ align: "end", type: "inner" }}
                  size={[150, 12]}
                  strokeColor="linear-gradient(to right, #4A90E2 6%, #8BD8FA 100%)"
                />
              </Flex>
            </div>
            <div className="summary-row-db">
              <p
                style={{
                  color: "#383838",
                  fontSize: "14px",
                  fontWeight: "600",
                  margin: "0",
                }}
              >
                Tài sản:
              </p>
              <CiMoneyBill
                style={{
                  width: "36px",
                  height: "36px",
                  color: "#219415",
                }}
              />
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  margin: "0",
                }}
              >
                12,497
              </p>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "400",
                  margin: "0",
                }}
              >
                Đạt được <span>50%</span>
              </p>
              <Flex vertical gap="small" style={{ width: 180 }}>
                <Progress
                  percent={50}
                  percentPosition={{ align: "end", type: "inner" }}
                  size={[150, 12]}
                  strokeColor="linear-gradient(to right, #2DB71E 6%, #AAD8A5 100%)"
                />
              </Flex>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          margin: "3% 0",
          display: "flex",
          alignItems: "center",
          gap: "3%",
          backgroundColor: "#6EB566",
          borderRadius: "10px",
          width: "40%",
        }}
      >
        <img
          src={videos.avatar_large_url}
          alt="TikTok Banner"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            margin: "5%",
          }}
        />
        <div
          style={{
            width: "100%",
          }}
        >
          <h1
            style={{
              color: "white",
            }}
          >
            {videos.user_name}
          </h1>
          <span
            style={{
              color: "white",
              marginRight: "3%",
            }}
          >
            {videos.follower_count} Followers
          </span>
          <span
            style={{
              color: "white",
              marginLeft: '5%'
            }}
          >
            {videos.likes_count} Likes
          </span>
        </div>
      </div>
      <div className="stats-boxes">
        <div className="stat-card">
          <IoEyeSharp
            style={{
              height: "37px",
              width: "37px",
              color: "#43903A",
            }}
          />
          <p
            style={{
              margin: "0",
              fontSize: "15px",
            }}
          >
            Lượt xem video
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              {videos1.view_count}
            </span>
            <span
              style={{
                color: "green",
                fontSize: "12px",
                marginLeft: "5px",
                padding: "2px 5px",
                backgroundColor: "#e6f7ff",
                borderRadius: "5px",
              }}
            >
              <BsArrowUp /> 7.34%
            </span>
          </div>
        </div>
        <div className="stat-card">
          <AiFillLike
            style={{
              height: "37px",
              width: "37px",
              color: "#43903A",
            }}
          />
          <p
            style={{
              margin: "0",
              fontSize: "15px",
            }}
          >
            Lượt thích
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              {videos1.like_count}
            </span>
            <span
              style={{
                color: "green",
                fontSize: "12px",
                marginLeft: "5px",
                padding: "2px 5px",
                backgroundColor: "#e6f7ff",
                borderRadius: "5px",
              }}
            >
              <BsArrowUp /> 7.34%
            </span>
          </div>
        </div>
        <div className="stat-card">
          <LiaComment
            style={{
              height: "37px",
              width: "37px",
              color: "#43903A",
            }}
          />
          <p
            style={{
              margin: "0",
              fontSize: "15px",
            }}
          >
            Bình luận
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              {videos1.comment_count}
            </span>
            <span
              style={{
                color: "green",
                fontSize: "12px",
                marginLeft: "5px",
                padding: "2px 5px",
                backgroundColor: "#e6f7ff",
                borderRadius: "5px",
              }}
            >
              <BsArrowUp /> 7.34%
            </span>
          </div>
        </div>
        <div className="stat-card">
          <IoIosShareAlt
            style={{
              height: "37px",
              width: "37px",
              color: "#43903A",
            }}
          />
          <p
            style={{
              margin: "0",
              fontSize: "15px",
            }}
          >
            Lượt chia sẻ
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              {videos1.share_count}
            </span>
            <span
              style={{
                color: "red",
                fontSize: "12px",
                marginLeft: "5px",
                padding: "2px 5px",
                backgroundColor: "#e6f7ff",
                borderRadius: "5px",
              }}
            >
              <BsArrowDown /> 7.34%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
          <div className="main-content">
            <div className="chart-box">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "5%",
                }}
                className="chart-header"
              >
                <h3>Lượt truy cập theo ngày</h3>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datatt}>
                  <defs>
                    <linearGradient id="colorTruyCap" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1890FF" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#1890FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="truyCap"
                    stroke="#1890FF"
                    fill="url(#colorTruyCap)"
                    name="Lượt truy cập"
                  />
                  <Line
                    type="monotone"
                    dataKey="truyCap"
                    stroke="#1890FF"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Lượt truy cập"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

      {/* đang làm */}
      <div
        style={{
          padding: "2% 2%",
          marginTop: "2%",
          background: "white",
          borderRadius: "10px",
        }}
      >
        <h1>Top bài viết nổi bật</h1>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            width: "100%",
            padding: "16px 0",
          }}
        >
          <img
            src={h4}
            alt="TikTok Post"
            style={{ width: "10%", borderRadius: "8px" }}
          />

          <div style={{ flex: 1, marginLeft: "2%" }}>
            <p style={{ margin: 0, fontSize: "24px" }}>
              Đón chào xmark sau 3 ngày với công cụ mới nhé!
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "8px 0",
                justifyContent: "space-between",
                width: "25%",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <IoIosHeartEmpty
                  style={{
                    fontSize: "24px",
                    color: "red",
                  }}
                />
                <span
                  style={{
                    fontSize: "24px",
                  }}
                >
                  128
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <FaRegCommentDots
                  style={{
                    fontSize: "24px",
                  }}
                />
                <span
                  style={{
                    fontSize: "24px",
                  }}
                >
                  2
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <BsBookmark
                  style={{
                    fontSize: "24px",
                  }}
                />
                <span
                  style={{
                    fontSize: "24px",
                  }}
                >
                  10
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                marginTop: "3%",
              }}
            >
              <img
                src={h5}
                alt="User Avatar"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "20px" }}>
                  Linh Chi Boutique’s
                </p>
                <p style={{ margin: 0, fontSize: "20px" }}>Áo đẹp lắm</p>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            width: "100%",
            padding: "16px 0",
          }}
        >
          <img
            src={h1}
            alt="TikTok Post"
            style={{ width: "10%", borderRadius: "8px" }}
          />

          <div style={{ flex: 1, marginLeft: "2%" }}>
            <p style={{ margin: 0, fontSize: "24px" }}>
              Đàn ông mặc gì để không đụng hàng?
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "8px 0",
                justifyContent: "space-between",
                width: "25%",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <IoIosHeartEmpty
                  style={{
                    fontSize: "24px",
                    color: "red",
                  }}
                />
                <span
                  style={{
                    fontSize: "24px",
                  }}
                >
                  78
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <FaRegCommentDots
                  style={{
                    fontSize: "24px",
                  }}
                />
                <span
                  style={{
                    fontSize: "24px",
                  }}
                >
                  1
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <BsBookmark
                  style={{
                    fontSize: "24px",
                  }}
                />
                <span
                  style={{
                    fontSize: "24px",
                  }}
                >
                  3
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                marginTop: "1%",
              }}
            >
              <img
                src={h6}
                alt="User Avatar"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "20px" }}>
                  Mẹ Thịnh
                </p>
                <p style={{ margin: 0, fontSize: "20px" }}>Áo đẹp lắm nha</p>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            width: "100%",
            padding: "16px 0",
          }}
        >
          <img
            src={h2}
            alt="TikTok Post"
            style={{ width: "10%", borderRadius: "8px" }}
          />

          <div style={{ flex: 1, marginLeft: "2%" }}>
            <p style={{ margin: 0, fontSize: "24px" }}>
              Đón chào xmark sau 3 ngày với công cụ mới nhé!
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "8px 0",
                justifyContent: "space-between",
                width: "25%",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <IoIosHeartEmpty
                  style={{
                    fontSize: "24px",
                    color: "red",
                  }}
                />
                <span
                  style={{
                    fontSize: "24px",
                  }}
                >
                  6
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <FaRegCommentDots
                  style={{
                    fontSize: "24px",
                  }}
                />
                <span
                  style={{
                    fontSize: "24px",
                  }}
                >
                  5
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <BsBookmark
                  style={{
                    fontSize: "24px",
                  }}
                />
                <span
                  style={{
                    fontSize: "24px",
                  }}
                >
                  1
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                marginTop: "2%",
              }}
            >
              <img
                src={h3}
                alt="User Avatar"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "20px" }}>
                  nhs9x.shop
                </p>
                <p style={{ margin: 0, fontSize: "20px" }}>Xin địa chỉ ak</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
