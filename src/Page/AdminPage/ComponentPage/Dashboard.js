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

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("month");
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videos1, setVideos1] = useState([]);
  const [loading, setLoading] = useState(true);
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
    const fetchStats = async () => {
      try {
        setLoading(true);
        const filter = timeRange === "all" ? undefined : timeRange;
        const res = await appService.getStats(filter);
        setStats(res.data);
        
        if (res.data?.chartData) {
          setChartData(res.data.chartData);
        } else {
          const currentData = res.data?.current || {};
          setChartData([
            {
              name: res.data?.period || "Hiện tại",
              donDat: currentData.orders || 0,
              doanhThu: currentData.revenue || 0,
            }
          ]);
        }
        
        console.log("📊 Stats data:", res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);


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
            Sản phẩm
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
              {loading ? "..." : stats?.current?.products || 0}
            </span>
            <span
              style={{
                color: stats?.growth?.products >= 0 ? "green" : "red",
                fontSize: "12px",
                marginLeft: "5px",
                padding: "2px 5px",
                backgroundColor: "#e6f7ff",
                borderRadius: "5px",
              }}
            >
              {stats?.growth?.products >= 0 ? <BsArrowUp /> : <BsArrowDown />} 
              {stats?.growth?.products || 0}%
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
              {loading ? "..." : stats?.current?.users || 0}
            </span>
            <span
              style={{
                color: stats?.growth?.users >= 0 ? "green" : "red",
                fontSize: "12px",
                marginLeft: "5px",
                padding: "2px 5px",
                backgroundColor: "#e6f7ff",
                borderRadius: "5px",
              }}
            >
              {stats?.growth?.users >= 0 ? <BsArrowUp /> : <BsArrowDown />} 
              {stats?.growth?.users || 0}%
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
              {loading ? "..." : (stats?.current?.revenue || 0).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
            <span
              style={{
                color: stats?.growth?.revenue >= 0 ? "green" : "red",
                fontSize: "12px",
                marginLeft: "5px",
                padding: "2px 5px",
                backgroundColor: "#e6f7ff",
                borderRadius: "5px",
              }}
            >
              {stats?.growth?.revenue >= 0 ? <BsArrowUp /> : <BsArrowDown />} 
              {stats?.growth?.revenue || 0}%
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
            Đơn đặt hàng
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
              {loading ? "..." : stats?.current?.orders || 0}
            </span>
            <span
              style={{
                color: stats?.growth?.orders >= 0 ? "green" : "red",
                fontSize: "12px",
                marginLeft: "5px",
                padding: "2px 5px",
                backgroundColor: "#e6f7ff",
                borderRadius: "5px",
              }}
            >
              {stats?.growth?.orders >= 0 ? <BsArrowUp /> : <BsArrowDown />} 
              {stats?.growth?.orders || 0}%
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
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="all">Tất cả</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="donDat"
                stroke="#FF4C4C"
                name="Số đơn đặt"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="doanhThu"
                stroke="#00C49F"
                name="Doanh thu (VND)"
                strokeWidth={2}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "Doanh thu (VND)") {
                    return value.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    });
                  }
                  return value;
                }}
              />
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
              {loading ? "..." : (stats?.current?.revenue || 0).toLocaleString("vi-VN", {
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
                    {loading ? "..." : (stats?.current?.revenue || 0).toLocaleString("vi-VN", {
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
                {loading ? "..." : (stats?.current?.revenue || 0).toLocaleString("vi-VN", {
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

      
    </div>
  );
}
