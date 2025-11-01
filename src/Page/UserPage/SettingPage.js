import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Typography,
  Tabs,
  message,
  Spin,
  Space,
  Row,
  Col,
  Divider,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { localUserService } from "../../service/localService";
import { appService } from "../../service/appService";
import "./SettingPage.css";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function SettingPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // Lấy userId từ localStorage
  const userId = localUserService.getUserId() || localUserService.get()?._id;

  // Fetch thông tin người dùng
  const fetchUser = async () => {
    if (!userId) {
      message.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      return;
    }

    setLoading(true);
    try {
      const res = await appService.getUserById(userId);
      const userData = res.data;
      setUser(userData);
      profileForm.setFieldsValue({
        username: userData.username,
        "user_profile.name": userData.user_profile?.name || "",
        "user_profile.phone": userData.user_profile?.phone || "",
        "user_profile.email": userData.user_profile?.email || "",
        "user_profile.address": userData.user_profile?.address || "",
        "user_profile.citizenNumber": userData.user_profile?.citizenNumber || "",
      });
    } catch (err) {
      console.error("Lỗi lấy thông tin user:", err);
      message.error("Không thể tải thông tin. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  // Cập nhật hồ sơ
  const handleUpdateProfile = async (values) => {
    setUpdating(true);
    try {
      const payload = {
        username: values.username,
        user_profile: {
          name: values["user_profile.name"],
          phone: values["user_profile.phone"],
          email: values["user_profile.email"],
          address: values["user_profile.address"],
          citizenNumber: values["user_profile.citizenNumber"],
        },
      };

      await appService.updateUser(userId, payload);
      message.success("Cập nhật hồ sơ thành công!");
      fetchUser(); // Refresh
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      message.error("Cập nhật thất bại. Vui lòng kiểm tra lại.");
    } finally {
      setUpdating(false);
    }
  };

  // Đổi mật khẩu
  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      passwordForm.setFields([
        { name: "confirmPassword", errors: ["Mật khẩu xác nhận không khớp!"] },
      ]);
      return;
    }

    setChangingPass(true);
    try {
      await appService.updateUser(userId, {
        password: values.newPassword,
      });
      message.success("Đổi mật khẩu thành công!");
      passwordForm.resetFields();
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);
      message.error("Đổi mật khẩu thất bại. Vui lòng thử lại.");
    } finally {
      setChangingPass(false);
    }
  };

  if (!userId) {
    return (
      <div className="setting-container">
        <Card>
          <Text type="danger">Vui lòng đăng nhập để xem trang này.</Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="setting-container">
      <div className="setting-header">
        <Title level={2}>
          <EditOutlined /> Cài đặt tài khoản
        </Title>
        <Text type="secondary">Quản lý thông tin cá nhân và bảo mật tài khoản</Text>
      </div>

      {loading ? (
        <Card className="loading-card">
          <Spin size="large" tip="Đang tải thông tin..." />
        </Card>
      ) : (
        <Card className="setting-card">
          <Row gutter={24}>
            {/* Avatar + Info */}
            <Col xs={24} md={8} className="user-info-section">
              <div className="avatar-wrapper">
                <Avatar size={120} icon={<UserOutlined />} className="user-avatar" />
              </div>
              <div className="user-info">
                <Title level={4}>{user?.username || "Người dùng"}</Title>
                <Space direction="vertical" size={4}>
                  <Text>
                    <MailOutlined /> {user?.user_profile?.email || "Chưa có email"}
                  </Text>
                  <Text>
                    <IdcardOutlined /> {user?.user_roles || "Member"}
                  </Text>
                </Space>
              </div>
            </Col>

            {/* Tabs */}
            <Col xs={24} md={16}>
              <Tabs defaultActiveKey="1" className="setting-tabs">
                {/* Hồ sơ */}
                <TabPane
                  tab={
                    <span>
                      <UserOutlined /> Hồ sơ cá nhân
                    </span>
                  }
                  key="1"
                >
                  <Form
                    form={profileForm}
                    layout="vertical"
                    onFinish={handleUpdateProfile}
                  >
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          name="username"
                          label="Tên đăng nhập"
                          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
                        >
                          <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Divider orientation="left">Thông tin cá nhân</Divider>

                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={["user_profile", "name"]}
                          label="Họ tên"
                        >
                          <Input placeholder="Nguyễn Văn A" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={["user_profile", "phone"]}
                          label="Số điện thoại"
                          rules={[{ pattern: /^[0-9]{10,11}$/, message: "SĐT không hợp lệ!" }]}
                        >
                          <Input prefix={<PhoneOutlined />} placeholder="0901234567" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={["user_profile", "email"]}
                          label="Email"
                          rules={[{ type: "email", message: "Email không hợp lệ!" }]}
                        >
                          <Input prefix={<MailOutlined />} placeholder="example@gmail.com" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={["user_profile", "citizenNumber"]}
                          label="CCCD/CMND"
                        >
                          <Input placeholder="123456789" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          name={["user_profile", "address"]}
                          label="Địa chỉ"
                        >
                          <Input.TextArea rows={2} placeholder="123 Đường ABC, Quận 1, TP.HCM" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={updating}
                        icon={<SaveOutlined />}
                        size="large"
                      >
                        Lưu thay đổi
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>

                {/* Đổi mật khẩu */}
                <TabPane
                  tab={
                    <span>
                      <LockOutlined /> Đổi mật khẩu
                    </span>
                  }
                  key="2"
                >
                  <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handleChangePassword}
                    style={{ maxWidth: 400 }}
                  >
                    <Form.Item
                      name="currentPassword"
                      label="Mật khẩu hiện tại"
                      rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
                    >
                      <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                    </Form.Item>

                    <Form.Item
                      name="newPassword"
                      label="Mật khẩu mới"
                      rules={[
                        { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                        { min: 6, message: "Mật khẩu ít nhất 6 ký tự!" },
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      label="Xác nhận mật khẩu"
                      rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}
                    >
                      <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        danger
                        htmlType="submit"
                        loading={changingPass}
                        icon={<LockOutlined />}
                        size="large"
                        block
                      >
                        Đổi mật khẩu
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
}