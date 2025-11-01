import React, { useState, useEffect } from "react";
import { Card, Button, Input, Select, Pagination, Tag, Statistic, message, Form, Row, Col, Space, Typography } from "antd";
import { ClockCircleOutlined, FireOutlined, PlusOutlined, ThunderboltOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import "./AutionPage.css";

dayjs.extend(duration);

const { Title, Text } = Typography;
const { Countdown } = Statistic;

export default function AutionPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [form] = Form.useForm();
  const itemsPerPage = 8;

  // Tạo dữ liệu ảo
  useEffect(() => {
    const fakeAuctions = Array.from({ length: 20 }).map((_, i) => {
      const start = new Date();
      const end = new Date(start.getTime() + (Math.random() * 10 + 2) * 60 * 1000);
      return {
        _id: `auction-${i}`,
        product: `Pin Lithium ${["NMC", "LFP", "Solid-State"][i % 3]} ${2025 + (i % 3)}`,
        start_price: Math.floor(Math.random() * 800000 + 500000),
        current_bid: Math.floor(Math.random() * 1200000 + 900000),
        start_date: start.toISOString(),
        end_date: end.toISOString(),
        status: "active",
        bidder_count: Math.floor(Math.random() * 50) + 5,
      };
    });
    setItems(fakeAuctions);
  }, []);

  // Tạo đấu giá mới
  const handleCreateAuction = (values) => {
    if (!values.product || !values.start_price) {
      message.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const start = new Date();
      const end = new Date(start.getTime() + values.duration * 60 * 1000);

      const newItem = {
        _id: `auction-${Date.now()}`,
        product: values.product,
        start_price: parseInt(values.start_price),
        current_bid: parseInt(values.start_price),
        start_date: start.toISOString(),
        end_date: end.toISOString(),
        status: "active",
        bidder_count: 1,
      };

      setItems([newItem, ...items]);
      form.resetFields();
      message.success("Tạo phiên đấu giá thành công!");
      setLoading(false);
    }, 800);
  };

  // Phân trang
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const displayedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="auction-container">
      {/* Header */}
      <div className="auction-header">
        <div className="header-content">
          <Title level={1} className="header-title">
            <FireOutlined className="fire-icon" /> VINE Auction
          </Title>
          <Text type="secondary" className="header-subtitle">
            Đấu giá pin lithium-ion & công nghệ năng lượng — Minh bạch • Thông minh • Uy tín
          </Text>
        </div>
      </div>

      <div className="auction-body">
        {/* Form tạo đấu giá */}
        <Card className="create-card" title={<><PlusOutlined /> Tạo Phiên Đấu Giá Mới</>} bordered={false}>
          <Form form={form} layout="vertical" onFinish={handleCreateAuction}>
            <Row gutter={16}>
              <Col xs={24} md={10}>
                <Form.Item
                  name="product"
                  rules={[{ required: true, message: "Nhập tên sản phẩm!" }]}
                >
                  <Input
                    size="large"
                    placeholder="Tên sản phẩm (VD: Pin LFP 100Ah)"
                    prefix={<ThunderboltOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  name="start_price"
                  rules={[{ required: true, message: "Nhập giá khởi điểm!" }]}
                >
                  <Input
                    size="large"
                    type="number"
                    placeholder="Giá khởi điểm (VND)"
                    prefix="₫"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  name="duration"
                  initialValue={5}
                  rules={[{ required: true }]}
                >
                  <Select size="large">
                    <Select.Option value={1}>1 phút</Select.Option>
                    <Select.Option value={3}>3 phút</Select.Option>
                    <Select.Option value={5}>5 phút</Select.Option>
                    <Select.Option value={10}>10 phút</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={loading}
                    block
                    icon={<PlusOutlined />}
                  >
                    Tạo
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* Danh sách đấu giá */}
        <div className="auction-list">
          <Title level={3} className="section-title">
            <ClockCircleOutlined /> Phiên Đấu Giá Đang Diễn Ra
            <Tag color="volcano" style={{ marginLeft: 12 }}>
              {items.length} phiên
            </Tag>
          </Title>

          <Row gutter={[24, 24]}>
            {displayedItems.map((item) => {
              const deadline = new Date(item.end_date).getTime();
              const isEnding = deadline - Date.now() < 60000;

              return (
                <Col xs={24} sm={12} lg={8} xl={6} key={item._id}>
                  <Card
                    hoverable
                    className={`auction-card ${isEnding ? "ending-soon" : ""}`}
                    cover={
                      <div className="card-image-wrapper">
                        <img
                          alt={item.product}
                          src={`https://picsum.photos/seed/${item._id}/400/300`}
                          className="card-image"
                        />
                        <Tag color={isEnding ? "red" : "green"} className="status-tag">
                          {isEnding ? "Sắp kết thúc!" : "Đang đấu giá"}
                        </Tag>
                      </div>
                    }
                    actions={[
                      <Button type="primary" danger size="large" block>
                        <ThunderboltOutlined /> Đấu giá ngay
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      title={<Text strong>{item.product}</Text>}
                      description={
                        <Space direction="vertical" size={4} style={{ width: "100%" }}>
                          <div>
                            <Text type="secondary">Giá hiện tại:</Text>
                            <br />
                            <Text strong style={{ fontSize: 18, color: "#d4380d" }}>
                              {item.current_bid.toLocaleString()}₫
                            </Text>
                          </div>

                          <div>
                            <Text type="secondary">Giá khởi điểm:</Text>
                            <br />
                            <Text delete>{item.start_price.toLocaleString()}₫</Text>
                          </div>

                          <div className="countdown-wrapper">
                            <Text type="secondary">Còn lại:</Text>
                            <br />
                            <Countdown
                              value={deadline}
                              format="mm:ss"
                              valueStyle={{
                                fontSize: 18,
                                fontWeight: "bold",
                                color: isEnding ? "#cf1322" : "#389e0d",
                              }}
                            />
                          </div>

                          <div>
                            <Tag icon={<ThunderboltOutlined />} color="orange">
                              {item.bidder_count} người đấu
                            </Tag>
                          </div>
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <Pagination
                current={currentPage}
                total={items.length}
                pageSize={itemsPerPage}
                onChange={setCurrentPage}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} phiên`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="auction-footer">
        <Text type="secondary">
          © {new Date().getFullYear()} <strong>VINE Auction</strong> — Đấu giá công nghệ năng lượng tương lai.
        </Text>
      </footer>
    </div>
  );
}