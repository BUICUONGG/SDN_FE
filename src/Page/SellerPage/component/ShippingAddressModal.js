import React from "react";
import { Modal, Form, Input, Row, Col, Alert } from "antd";

export default function ShippingAddressModal({ visible, onCancel, onOk }) {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Chỉnh sửa địa chỉ vận chuyển"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      okText="Lưu"
      cancelText="Hủy bỏ"
      okButtonProps={{ style: { backgroundColor: "#6EB566", border: "none" } }}
    >
      <Alert
        message="Để đảm bảo quá trình kho vận diễn ra suôn sẻ và hiệu quả, vui lòng nhập chính xác địa chỉ kho."
        type="info"
        style={{ marginBottom: 16 }}
        showIcon
      />
      <Form form={form} layout="vertical">
        <Form.Item label="Tên kho hàng" name="warehouseName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Người liên hệ" name="contactPerson" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Địa chỉ" name="address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Chi tiết" name="detail">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
