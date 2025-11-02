import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../../service/profileService';

export default function ChangePass() {
  const [passwordForm] = Form.useForm();
  const [changingPass, setChangingPass] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      passwordForm.setFields([
        { name: "confirmPassword", errors: ["Mật khẩu xác nhận không khớp!"] },
      ]);
      return;
    }

    setChangingPass(true);
    try {
      const payload = {
        old_password: values.currentPassword,
        new_password: values.newPassword,
      };

      await profileService.changePassword(payload);
      message.success("Đổi mật khẩu thành công!");
      passwordForm.resetFields();
      
      // Chuyển về trang Hồ Sơ sau 1 giây
      setTimeout(() => {
        navigate('/settings');
      }, 1000);
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);
      const serverMsg = err?.response?.data?.message || err?.message;
      message.error(serverMsg || "Đổi mật khẩu thất bại. Vui lòng kiểm tra mật khẩu hiện tại.");
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="setting-container" style={{ padding: '20px' }}>
      <Card title="Đổi mật khẩu" style={{ maxWidth: 600, margin: '0 auto' }}>
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Nhập mật khẩu hiện tại" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Nhập mật khẩu mới" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Nhập lại mật khẩu mới" 
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={changingPass}
              block
              size="large"
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
