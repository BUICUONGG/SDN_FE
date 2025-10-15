import React, { useEffect, useState } from "react";
import { Input, Button, Pagination, Card, Row, Col } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { appService } from "../../../service/appService";
import { useNavigate } from "react-router-dom";

export default function Posts() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // AntD uses 1-based index
  const pageSize = 6;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const statusColorMap = {
    PENDING: "#FFA500", // Chờ xét duyệt - cam
    ACTIVE: "#00C851", // Đang hoạt động - xanh lá
    REJECTED: "#ff4444", // Từ chối - đỏ
    LOCKED: "#FF8800", // Tạm khóa - cam đậm
    INFO_REQUIRED: "#33b5e5", // Cần thêm thông tin - xanh dương
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    updateProductsByPage();
  }, [currentPage, allProducts]);

  const fetchAllProducts = () => {
    appService
      .getAllProductAdmin(0, 1000) // lấy số lượng lớn, hoặc dùng API getAll nếu có
      .then((res) => {
        if (res.data.status && res.data.metadata.status) {
          const all = res.data.metadata.metadata || [];
          setAllProducts(all);
          setCurrentPage(1); // về trang đầu sau khi load
          console.log(all);
        } else {
          setAllProducts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching all products:", err);
        setAllProducts([]);
      });
  };

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  const updateProductsByPage = () => {
    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setProducts(filtered.slice(start, end));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    updateProductsByPage();
  }, [currentPage, allProducts, searchTerm]);

  return (
    <div style={{ padding: "30px", background: "rgb(247, 247, 247)", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{ display: "flex", marginBottom: "20px", alignItems: "center" }}
      >
        <Input
          placeholder="Tìm kiếm sản phẩm"
          prefix={<SearchOutlined />}
          style={{ width: "250px", marginRight: "10px" }}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // trở lại trang đầu khi tìm kiếm
          }}
        />

        <Button icon={<FilterOutlined />} />
      </div>

      {/* Product Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {products.length === 0 ? (
          <p>Không có cửa hàng nào</p>
        ) : (
          products.map((store) => {
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
                      Tên sản phẩm : {store.name}
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
                    Mã sản phẩm - {store.productCode}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    navigate(`/admin-page/detailproducts/${store.id}`);
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

      {/* Pagination */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={allProducts.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}
