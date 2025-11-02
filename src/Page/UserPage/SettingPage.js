import React, { useState, useEffect, useCallback } from "react";
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
import { profileService } from "../../service/profileService";
import "./SettingPage.css";

const { Title, Text } = Typography;

export default function SettingPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");
  const [ordersList, setOrdersList] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  
  const accessToken = localUserService.getAccessToken();

  // Fetch thông tin người dùng
  const fetchUser = useCallback(async () => {
    if (!accessToken) {
      message.error("Vui lòng đăng nhập để xem trang này.");
      return;
    }
    
    const cachedInitial = localUserService.get();
    if (cachedInitial) {
      const initial = cachedInitial?.metadata || cachedInitial?.data || cachedInitial || {};
      setUser(initial);
      profileForm.setFieldsValue({
        username: initial.username || initial.email || "",
        user_profile: {
          name: initial?.user_profile?.name || initial?.name || "",
          phone: initial?.user_profile?.phone || initial?.phone || "",
          email: initial?.user_profile?.email || initial?.email || "",
          address: initial?.user_profile?.address || initial?.address || "",
          citizenNumber: initial?.user_profile?.citizenNumber || initial?.citizenNumber || "",
        },
      });
    }

    
    if (process.env.NODE_ENV === "development") {
      console.debug("DEBUG ACCESS_TOKEN:", localUserService.getAccessToken());
    }

    setLoading(true);
    try {
      const res = await profileService.getProfile();
      
      console.debug("profileService.getProfile response:", res);
      
      const raw = res?.data || {};
      const userData = raw.metadata || raw.data || raw.user || raw || {};
      setUser(userData);
      
      profileForm.setFieldsValue({
        username: userData.username || userData.email || "",
        user_profile: {
          name: userData?.user_profile?.name || userData?.name || "",
          phone: userData?.user_profile?.phone || userData?.phone || "",
          email: userData?.user_profile?.email || userData?.email || "",
          address: userData?.user_profile?.address || userData?.address || "",
          citizenNumber:
            userData?.user_profile?.citizenNumber || userData?.citizenNumber || "",
        },
      });
    } catch (err) {
      console.error("Lỗi lấy thông tin user:", err);
      const serverMsg = err?.response?.data?.message || err?.message;
      
      if (status === 401 || status === 403) {
        message.error("Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
        localUserService.remove();
        
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
        return;
      }
      
      const cached = localUserService.get();
      if (cached) {
        console.warn("Dùng dữ liệu cache từ localStorage vì gọi /profile thất bại.");
        
        const fallback = cached?.metadata || cached?.data || cached || {};
        setUser(fallback);
        profileForm.setFieldsValue({
          username: fallback.username || fallback.email || "",
          user_profile: {
            name: fallback?.user_profile?.name || fallback?.name || "",
            phone: fallback?.user_profile?.phone || fallback?.phone || "",
            email: fallback?.user_profile?.email || fallback?.email || "",
            address: fallback?.user_profile?.address || fallback?.address || "",
            citizenNumber:
              fallback?.user_profile?.citizenNumber || fallback?.citizenNumber || "",
          },
        });
        message.warning("Không thể tải profile từ server, hiển thị dữ liệu lưu cục bộ.");
      } else {
        message.error(serverMsg || "Không thể tải thông tin. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
    
  }, [accessToken]);

  useEffect(() => {
    fetchUser();
    
  }, []);

  
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      
      const res = await profileService.getProfileOrders({ page: 0, size: 20 });
      
      const data = res?.data?.metadata || res?.data?.data || res?.data || {};
      const items = data?.items || data?.rows || data?.content || data || [];
      setOrdersList(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Lỗi lấy lịch sử giao dịch:", err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        message.error("Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại để xem lịch sử giao dịch.");
        localUserService.remove();
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
        return;
      }
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // Load orders when transaction tab is active
  useEffect(() => {
    if (activeTab === "3") {
      fetchOrders();
    }
  }, [activeTab, fetchOrders]);

  // Cập nhật hồ sơ
  const handleUpdateProfile = async (values) => {
    setUpdating(true);
    try {
      // Backend's user object is flat (see GET /profile -> user), so send flat payload
      const payload = {
        username: values.username,
        name: values?.user_profile?.name,
        phone: values?.user_profile?.phone,
        email: values?.user_profile?.email,
        address: values?.user_profile?.address,
        citizenNumber: values?.user_profile?.citizenNumber,
      };

      const response = await profileService.updateProfile(payload);
      
      
      const updatedUser = response?.data?.metadata || response?.data?.data || response?.data || {};
      if (updatedUser && Object.keys(updatedUser).length > 0) {
        localUserService.set(updatedUser);
      }
      
      message.success("Cập nhật hồ sơ thành công!");
      setIsEditing(false); 
      fetchUser(); 
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      const serverMsg = err?.response?.data?.message || err?.message;
      message.error(serverMsg || "Cập nhật thất bại. Vui lòng kiểm tra lại.");
    } finally {
      setUpdating(false);
    }
  };

  // Hàm bật/tắt chế độ edit
  const handleEditToggle = () => {
    setIsEditing(prevState => !prevState);
  };

  
  const handleCancelEdit = () => {
    setIsEditing(false);
    
    profileForm.setFieldsValue({
      username: user?.username || user?.email || "",
      user_profile: {
        name: user?.user_profile?.name || user?.name || "",
        phone: user?.user_profile?.phone || user?.phone || "",
        email: user?.user_profile?.email || user?.email || "",
        address: user?.user_profile?.address || user?.address || "",
        citizenNumber: user?.user_profile?.citizenNumber || user?.citizenNumber || "",
      },
    });
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
      
      const payload = {
        old_password: values.currentPassword,
        new_password: values.newPassword,
      };

      await profileService.changePassword(payload); // PATCH /api/profile/password
      message.success("Đổi mật khẩu thành công!");
      passwordForm.resetFields();
      
      // Optional: Đăng xuất sau khi đổi mật khẩu để user đăng nhập lại với mật khẩu mới
      // setTimeout(() => {
      //   localUserService.remove();
      //   window.location.href = "/";
      // }, 1500);
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);
      const serverMsg = err?.response?.data?.message || err?.message;
      message.error(serverMsg || "Đổi mật khẩu thất bại. Vui lòng kiểm tra mật khẩu hiện tại.");
    } finally {
      setChangingPass(false);
    }
  };

  if (!accessToken) {
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
          <Spin size="large" />
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
              {(() => {
                const tabItems = [
                  {
                    key: '1',
                    label: (
                      <span>
                        <UserOutlined /> Hồ sơ cá nhân
                      </span>
                    ),
                    children: (
                      <div style={{ padding: '16px 0' }}>
                        {!isEditing ? (
                          // CHẾ ĐỘ XEM - Hiển thị thông tin dạng text
                          <div>
                            <Row gutter={[16, 24]}>
                              <Col span={24}>
                                <div style={{ marginBottom: 16 }}>
                                  <Text type="secondary">Tên đăng nhập</Text>
                                  <div style={{ fontSize: 16, marginTop: 8 }}>
                                    <UserOutlined style={{ marginRight: 8 }} />
                                    <Text strong>{user?.username || "Chưa cập nhật"}</Text>
                                  </div>
                                </div>
                              </Col>
                            </Row>

                            <Divider orientation="left">Thông tin cá nhân</Divider>

                            <Row gutter={[16, 24]}>
                              <Col xs={24} md={12}>
                                <div style={{ marginBottom: 16 }}>
                                  <Text type="secondary">Họ tên</Text>
                                  <div style={{ fontSize: 16, marginTop: 8 }}>
                                    <Text strong>{user?.user_profile?.name || user?.name || "Chưa cập nhật"}</Text>
                                  </div>
                                </div>
                              </Col>
                              <Col xs={24} md={12}>
                                <div style={{ marginBottom: 16 }}>
                                  <Text type="secondary">Số điện thoại</Text>
                                  <div style={{ fontSize: 16, marginTop: 8 }}>
                                    <PhoneOutlined style={{ marginRight: 8 }} />
                                    <Text strong>{user?.user_profile?.phone || user?.phone || "Chưa cập nhật"}</Text>
                                  </div>
                                </div>
                              </Col>
                            </Row>

                            <Row gutter={[16, 24]}>
                              <Col xs={24} md={12}>
                                <div style={{ marginBottom: 16 }}>
                                  <Text type="secondary">Email</Text>
                                  <div style={{ fontSize: 16, marginTop: 8 }}>
                                    <MailOutlined style={{ marginRight: 8 }} />
                                    <Text strong>{user?.user_profile?.email || user?.email || "Chưa cập nhật"}</Text>
                                  </div>
                                </div>
                              </Col>
                              <Col xs={24} md={12}>
                                <div style={{ marginBottom: 16 }}>
                                  <Text type="secondary">CCCD/CMND</Text>
                                  <div style={{ fontSize: 16, marginTop: 8 }}>
                                    <IdcardOutlined style={{ marginRight: 8 }} />
                                    <Text strong>{user?.user_profile?.citizenNumber || user?.citizenNumber || "Chưa cập nhật"}</Text>
                                  </div>
                                </div>
                              </Col>
                            </Row>

                            <Row gutter={[16, 24]}>
                              <Col span={24}>
                                <div style={{ marginBottom: 16 }}>
                                  <Text type="secondary">Địa chỉ</Text>
                                  <div style={{ fontSize: 16, marginTop: 8 }}>
                                    <Text strong>{user?.user_profile?.address || user?.address || "Chưa cập nhật"}</Text>
                                  </div>
                                </div>
                              </Col>
                            </Row>

                            <div style={{ marginTop: 24 }}>
                              <Button
                                type="primary"
                                onClick={handleEditToggle}
                                icon={<EditOutlined />}
                                size="large"
                              >
                                Chỉnh sửa thông tin
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // CHẾ ĐỘ CHỈNH SỬA - Hiển thị form input
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
                                  <Input 
                                    prefix={<UserOutlined />} 
                                    placeholder="Tên đăng nhập" 
                                  />
                                </Form.Item>
                              </Col>
                            </Row>

                            <Divider orientation="left">Thông tin cá nhân</Divider>

                            <Row gutter={16}>
                              <Col xs={24} md={12}>
                                <Form.Item name={["user_profile", "name"]} label="Họ tên">
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
                                <Form.Item name={["user_profile", "citizenNumber"]} label="CCCD/CMND">
                                  <Input placeholder="123456789" />
                                </Form.Item>
                              </Col>
                            </Row>

                            <Row gutter={16}>
                              <Col span={24}>
                                <Form.Item name={["user_profile", "address"]} label="Địa chỉ">
                                  <Input.TextArea rows={2} placeholder="123 Đường ABC, Quận 1, TP.HCM" />
                                </Form.Item>
                              </Col>
                            </Row>

                            <Form.Item>
                              <Space>
                                <Button
                                  type="primary"
                                  htmlType="submit"
                                  loading={updating}
                                  icon={<SaveOutlined />}
                                  size="large"
                                >
                                  Lưu thay đổi
                                </Button>
                                <Button
                                  onClick={handleCancelEdit}
                                  size="large"
                                  disabled={updating}
                                >
                                  Hủy
                                </Button>
                              </Space>
                            </Form.Item>
                          </Form>
                        )}
                      </div>
                    ),
                  },
                    {
                      key: '3',
                      label: (
                        <span>
                          <IdcardOutlined /> Lịch sử giao dịch
                        </span>
                      ),
                      children: (
                        <div style={{ padding: 12 }}>
                          {ordersLoading ? (
                            <Spin />
                          ) : ordersList.length === 0 ? (
                            <Text type="secondary">Chưa có giao dịch</Text>
                          ) : (
                            <div>
                              {ordersList.map((o) => (
                                <Card key={o.id || o.orderCode} style={{ marginBottom: 12 }}>
                                  <Row>
                                    <Col span={12}>
                                      <Text strong>Mã đơn:</Text> {o.orderCode || o.code || o.id}
                                    </Col>
                                    <Col span={12} style={{ textAlign: 'right' }}>
                                      <Text>{new Date(o.createdAt || o.createdAt || o.created_date || Date.now()).toLocaleString()}</Text>
                                    </Col>
                                  </Row>
                                  <Row style={{ marginTop: 8 }}>
                                    <Col span={12}>
                                      <Text>Trạng thái: </Text> {o.status || o.orderStatus}
                                    </Col>
                                    <Col span={12} style={{ textAlign: 'right' }}>
                                      <Text strong>Tổng:</Text> {o.total ? (Number(o.total).toLocaleString('vi-VN') + '₫') : "-"}
                                    </Col>
                                  </Row>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      ),
                    },
                  {
                    key: '2',
                    label: (
                      <span>
                        <LockOutlined /> Đổi mật khẩu
                      </span>
                    ),
                    children: (
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
                    ),
                  },
                ];
                return (
                  <Tabs
                    defaultActiveKey="1"
                    activeKey={activeTab}
                    onChange={(k) => setActiveTab(k)}
                    className="setting-tabs"
                    items={tabItems}
                  />
                );
              })()}
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
}

