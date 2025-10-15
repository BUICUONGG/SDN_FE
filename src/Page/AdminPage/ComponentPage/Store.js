import React, { useEffect, useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { appService } from "../../../service/appService";
import { localUserService } from "../../../service/localService";
import { useNavigate } from "react-router-dom";

const statusColorMap = {
  PENDING: "#FFA500", // Chờ xét duyệt - cam
  ACTIVE: "#00C851", // Đang hoạt động - xanh lá
  REJECTED: "#ff4444", // Từ chối - đỏ
  LOCKED: "#FF8800", // Tạm khóa - cam đậm
  INFO_REQUIRED: "#33b5e5", // Cần thêm thông tin - xanh dương
};

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function Store() {
  const [stores, setStores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [maxPage, setMaxPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    appService
      .getAllStore(currentPage, pageSize)
      .then((res) => {
        console.log("API response:", localUserService.getAccessToken());
        console.log(res);
        if (res.data.status && res.data.metadata.status) {
          setStores(res.data.metadata.metadata);
          setMaxPage(res.data.metadata.maxPage || 1);
        } else {
          console.error("API returned error");
          setStores([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching stores:", err);
        setStores([]);
      });
  }, [currentPage, pageSize]);

  return (
    <div style={{ padding: "30px", background: "rgb(247, 247, 247)" , minHeight: "90vh" }}>
      {/* Header */}
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <Input
          placeholder="Tìm kiếm"
          prefix={<SearchOutlined />}
          style={{ width: "250px", marginRight: "10px" }}
        />
        <Button icon={<FilterOutlined />} />
        <Button disabled style={{ marginLeft: "10px" }}>
          Quản lý cửa hàng
        </Button>
      </div>

      {/* Store Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {stores.length === 0 ? (
          <p>Không có cửa hàng nào</p>
        ) : (
          stores.map((store) => {
            const color = statusColorMap[store.verificationStatus] || "#999";

            return (
              <div
                key={store.id}
                style={{
                  background: "#fff",
                  borderRadius: "8px",
                  padding: "15px 20px",
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "30px",
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: "bold" }}>
                      Tên cửa hàng: {store.name} -{" "}
                      <span style={{ fontWeight: "400", opacity: "0.4" }}>
                        {store.businessType === "BUSINESS"
                          ? "Doanh nghiệp"
                          : store.businessType === "INDIVIDUAL"
                          ? "Cá nhân"
                          : store.businessType}
                      </span>
                    </p>
                    <p
                      style={{
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: color,
                          display: "inline-block",
                        }}
                      ></span>
                      {store.verificationStatus}
                    </p>
                  </div>
                  <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
                    Ngày tạo: {formatDate(store.createdDate)}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    navigate(`/admin-page/detail/${store.id}`)
                  }}
                  style={{
                    background: "#4CAF50",
                    color: "#fff",
                    border: "none",
                  }}
                  type="link"
                >
                  XEM CHI TIẾT
                </Button>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "#fff",
          padding: "10px 15px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Trang trước
        </Button>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, maxPage))}
          disabled={currentPage === maxPage}
        >
          Trang sau
        </Button>
        <span>
          Trang {currentPage} / {maxPage}
        </span>
      </div>
    </div>
  );
}
