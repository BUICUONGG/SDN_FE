// src/Page/CreateAuctionPage.js
import React, { useEffect, useState } from "react";
import { appService } from "../../service/appService";
import { Form, Select, Input, DatePicker, Button, message, Spin, Card, Alert } from "antd";
import { format } from "date-fns";
import { LockOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function CreateAuctionPage() {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("USER_INFO") || "{}");
    if (!user || user.user_roles !== "Admin") {
      message.error("Bạn không có quyền truy cập trang này!");
      window.location.href = "/";
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await appService.getAllProduct();
        setProducts(res.data.products || []);
      } catch (err) {
        message.error("Không tải được danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const onFinish = async (values) => {
    setSubmitting(true);
    console.log(values)
    try {
      const payload = {
        product: values.product,
        start_price: parseInt(values.start_price),
        deposit_required: parseInt(values.deposit_required),
        start_date: values.dates[0].toISOString(),
        end_date: values.dates[1].toISOString(),
        status: "scheduled",
        winner: null,
      };

      await appService.postAution(payload);
      message.success("Tạo đấu giá thành công!");
      form.resetFields();
      window.location.href = "/auction-channel";
    } catch (err) {
      message.error(err.response?.data?.message || "Tạo đấu giá thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  if (loading) {
    return (
      <div className="loading">
        <Spin size="large" />
        <p>Đang kiểm tra quyền...</p>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; }

        .container { max-width: 900px; margin: 40px auto; padding: 0 20px; }
        .header { text-align: center; margin-bottom: 32px; }
        .header h1 { font-size: 32px; font-weight: bold; color: #1e293b; }
        .header p { color: #64748b; margin-top: 8px; }

        .card {
          background: white; border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 32px;
        }

        .form-item { margin-bottom: 24px; }
        .label { font-weight: 600; color: #374151; margin-bottom: 8px; display: block; }

        .ant-form-item-label > label { font-weight: 600 !important; color: #374151 !important; }

        .product-preview {
          background: #f8fafc; padding: 16px; border-radius: 12px;
          border: 1px solid #e2e8f0; margin-top: 8px;
        }
        .product-name { font-weight: bold; color: #1e293b; font-size: 16px; }
        .product-info { color: #64748b; font-size: 14px; margin-top: 4px; }

        .submit-btn {
          background: linear-gradient(to right, #3b82f6, #6366f1);
          border: none; height: 48px; font-size: 16px;
          font-weight: bold; border-radius: 12px; color: white;
        }
        .submit-btn:hover { opacity: 0.9; }

        .loading {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; height: 100vh; gap: 16px;
          font-size: 18px; color: #64748b;
        }

        .admin-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: #dcfce7; color: #166534; padding: 8px 16px;
          border-radius: 999px; font-weight: bold; font-size: 14px;
          margin-bottom: 16px;
        }

        .ant-select-selector, .ant-input, .ant-picker {
          border-radius: 12px !important; height: 48px !important;
        }
      `}</style>

      <div className="container">
        <div className="header">
          <h1>Tạo Phiên Đấu Giá Mới</h1>
          <p>Chỉ Admin mới có quyền tạo</p>
        </div>

        <Card className="card">
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div className="admin-badge">
              <LockOutlined /> Quyền: ADMIN
            </div>
          </div>

          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item name="product" label="Chọn sản phẩm" rules={[{ required: true, message: "Vui lòng chọn sản phẩm!" }]}>
              <Select showSearch placeholder="Tìm và chọn sản phẩm..." size="large">
                {products.map(p => (
                  <Option key={p._id} value={p._id}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.vehicle?.[0]?.name || p.slug}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>
                        {p.battery?.name || "Không có pin"} • {formatPrice(p.price)}
                      </div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item shouldUpdate noStyle>
              {({ getFieldValue }) => {
                const selected = products.find(p => p._id === getFieldValue("product"));
                if (!selected) return null;
                const v = selected.vehicle?.[0] || {};
                const b = selected.battery || {};
                return (
                  <div className="product-preview">
                    <div className="product-name">{v.name || selected.slug}</div>
                    <div className="product-info">
                      Năm: <strong>{v.year || "—"}</strong> | 
                      Km: <strong>{v.mileage?.toLocaleString() || "—"}</strong> | 
                      Màu: <strong>{v.color || "—"}</strong>
                    </div>
                    <div className="product-info">
                      Pin: <strong>{b.name || "—"}</strong> | 
                      {b.capacity || 0} kWh | SOH: {b.healthPercentage || 0}%
                    </div>
                    <div className="product-info">
                      Giá gốc: <strong>{formatPrice(selected.price)}</strong> | 
                      Tồn kho: <strong>{selected.stock}</strong>
                    </div>
                  </div>
                );
              }}
            </Form.Item>

            <Form.Item name="start_price" label="Giá khởi điểm (VND)" rules={[{ required: true }]}>
              <Input type="number" size="large" placeholder="Ví dụ: 50000000" />
            </Form.Item>

            <Form.Item name="deposit_required" label="Số tiền đặt cọc (VND)" rules={[{ required: true }]}>
              <Input type="number" size="large" placeholder="Ví dụ: 5000000" />
            </Form.Item>

            <Form.Item name="dates" label="Thời gian đấu giá" rules={[{ required: true }]}>
              <DatePicker.RangePicker
                showTime format="DD/MM/YYYY HH:mm" size="large"
                style={{ width: "100%" }}
                disabledDate={current => current && current < new Date().setHours(0,0,0,0)}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting} block size="large" className="submit-btn">
                {submitting ? "Đang tạo..." : "Tạo Phiên Đấu Giá"}
              </Button>
            </Form.Item>
          </Form>

          <Alert
            message="Lưu ý"
            description="Thời gian kết thúc phải sau thời gian bắt đầu ít nhất 1 giờ."
            type="info" showIcon style={{ marginTop: 24, borderRadius: 12 }}
          />
        </Card>
      </div>
    </>
  );
}