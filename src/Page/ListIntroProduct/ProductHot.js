import React, { useEffect, useState } from "react";
import { Card, Button, Tabs, Row, Col, Spin } from "antd";
import { CameraOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { localUserService } from "../../service/localService";
import { appService } from "../../service/appService";
import { useNavigate } from "react-router-dom";
const { Meta } = Card;
const { TabPane } = Tabs;

const statuses = [
  "Tất cả",
  "mới cập nhật",
  "hot trend",
  "handmade",
  "tái sử dụng sáng tạo",
];

const ProductHot = () => {
  const [products, setProducts] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 12;
  const navigate = useNavigate();

  const fetchProducts = async (page, tab) => {
    setLoading(true);
    try {
      const response = await appService.getAllProduct(1, 1000); // ⚠️ lấy nhiều sản phẩm hơn để lọc
      let data = response?.data?.metadata?.metadata || [];

      if (tab !== "Tất cả") {
        data = data.filter((product) => product.status === tab);
      }

      // phân trang frontend thủ công
      const total = data.length;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const pagedData = data.slice(start, end);

      setProducts(pagedData);
      setTotalPages(Math.ceil(total / pageSize));
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, selectedTab);
  }, [currentPage, selectedTab]);

  const handleTabChange = (key) => {
    setSelectedTab(key);
    setCurrentPage(1); // reset về trang đầu
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div style={{ padding: "5% 10%" }}>
      <h2
        style={{
          textAlign: "center",
          color: "green",
          fontStyle: "italic",
          fontSize: "30px",
          fontWeight: "700",
        }}
      >
        Sản Phẩm
      </h2>

      <Tabs activeKey={selectedTab} onChange={handleTabChange} centered>
        {statuses.map((status) => (
          <TabPane
            tab={
              <span
                style={{
                  color: selectedTab === status ? "green" : undefined,
                  fontWeight: "bold",
                }}
              >
                {status}
              </span>
            }
            key={status}
          />
        ))}
      </Tabs>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
            {products.map((product) => (
              <Col xs={12} sm={8} md={6} lg={4} xl={4} key={product.id}>
                <Card
                  hoverable
                  onClick={() => navigate(`/product/${product.id}`)}
                    cover={
                      <div
                        style={{
                          height: "250px", // hoặc điều chỉnh theo ý
                          background: "#f5f5f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          borderTopLeftRadius: "8px",
                          borderTopRightRadius: "8px"
                        }}
                      >
                        <img
                          alt={product.name}
                          src={product.imageUrl || "https://via.placeholder.com/150"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "top",
                          }}
                        />
                      </div>
                    }
                  actions={[<CameraOutlined key="view" />]}
                >
                  <Meta
                    title={product.name}
                    description={`Tình trạng: ${
                      product.productCondition || "N/A"
                    }`}
                  />
                  <p
                    style={{ color: "green", fontWeight: "bold", marginTop: 8 }}
                  >
                    ₫{product.resalePrice?.toLocaleString("vi-VN") || "N/A"}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>

          {products.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 30,
                flexWrap: "wrap",
              }}
            >
              <Button
                icon={<LeftOutlined />}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ margin: "0 5px" }}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  style={{
                    margin: "0 5px",
                    backgroundColor:
                      currentPage === i + 1 ? "green" : undefined,
                    color: currentPage === i + 1 ? "white" : undefined,
                  }}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1 < 10 ? `0${i + 1}` : i + 1}
                </Button>
              ))}
              <Button
                icon={<RightOutlined />}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{ margin: "0 5px" }}
              />
            </div>
          )}

          {products.length === 0 && (
            <p style={{ textAlign: "center", marginTop: 50 }}>
              Không có sản phẩm thuộc nhóm này.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ProductHot;
