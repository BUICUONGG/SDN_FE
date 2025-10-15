import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Tabs,
  Tag,
  Select,
  Space,
  Pagination,
  Typography,
  Spin,
  Empty,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { ImNotification } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { appService } from "../../../service/appService";

const { Title } = Typography;
const { TabPane } = Tabs;

export default function AllProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabKey, setTabKey] = useState("all");
  const [subTabKey, setSubTabKey] = useState("allSub");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await appService.getOwnerProduct(page - 1, pageSize);
      setProducts(res.data.metadata.metadata || []); // điều chỉnh nếu cấu trúc khác
      setTotal(res.data.totalElements || 0);
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };

  console.log(products)

  useEffect(() => {
    fetchProducts();
  }, [page, pageSize]);

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const handleThem = () => {
    navigate("/seller-page/addProduct");
  };

  const filterProducts = () => {
    let data = [...products];

    if (tabKey !== "all") {
      data = data.filter((item) => item.status === tabKey);
    }

    if (subTabKey === "missing") {
      data = data.filter((item) => item.contentQuality === "Thiếu nội dung");
    } else if (subTabKey === "improve") {
      data = data.filter((item) => item.contentQuality === "Cần cải thiện");
    }

    if (searchText) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(searchText)
      );
    }

    return data;
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <img src={record.imageUrl || "https://via.placeholder.com/60"} alt="product" width={40} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Doanh số",
      dataIndex: "sales",
      key: "sales",
    },
    {
      title: "Giá",
      dataIndex: "resalePrice",
      key: "resalePrice",
    },
    {
      title: "Kho hàng",
      dataIndex: "inventory",
      key: "inventory",
    },
    {
      title: "Chất lượng sản phẩm",
      dataIndex: "productCondition",
      key: "productCondition",
      render: (text) => {
        let color = "green";
        if (text === "Cần cải thiện") color = "orange";
        if (text === "Thiếu nội dung") color = "red";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: () => <Button size="small">Sửa</Button>,
    },
  ];

  return (
    <div style={{ padding: "2%" }}>
      <div
        style={{
          width: "100%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          marginBottom: "2%",
          height: "5vh",
          overflow: "hidden",
        }}
      >
        <span style={{ width: "5px", height: "100%", backgroundColor: "#6EB566", marginRight: "10px" }}></span>
        <ImNotification style={{ color: "#6EB566" }} />
        <span style={{ fontSize: "14px", color: "#000", marginLeft: "10px" }}>
          Đơn đăng ký của bạn hiện đang trong quá trình xét duyệt. Sản phẩm của bạn sẽ hiển thị với khách hàng sau khi hoàn tất xác minh. Cảm ơn bạn đã kiên nhẫn chờ đợi!
        </span>
      </div>

      <div style={{ padding: 24, background: "#fff", borderRadius: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Title level={3}>Sản phẩm</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleThem}>
            Thêm sản phẩm mới
          </Button>
        </div>

        <Tabs activeKey={tabKey} onChange={setTabKey} type="line">
          <TabPane tab="Tất cả" key="all" />
          <TabPane tab="Đang hoạt động" key="active" />
          <TabPane tab="Vi phạm" key="violations" />
          <TabPane tab="Chờ duyệt bởi Xmark" key="pending" />
          <TabPane tab="Chưa được đăng" key="unlisted" />
        </Tabs>

        <Tabs activeKey={subTabKey} onChange={setSubTabKey} type="card">
          <TabPane tab="Tất cả" key="allSub" />
          <TabPane tab="Cần bổ sung" key="missing" />
          <TabPane tab="Cần cải thiện nội dung" key="improve" />
        </Tabs>

        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <Input.Search
            placeholder="Tìm sản phẩm, SKU..."
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ flex: 1 }}
          />
          <Select placeholder="Ngành hàng" style={{ width: 200 }}>
            <Select.Option value="all">Tất cả</Select.Option>
          </Select>
        </div>

        <Spin spinning={loading}>
          <Table
            dataSource={filterProducts()}
            columns={columns}
            pagination={false}
            bordered
            rowKey={(record) => record.id || record.key}
            locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
          />
        </Spin>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
}
