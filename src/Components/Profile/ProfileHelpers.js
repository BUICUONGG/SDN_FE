import React from "react";
import { Alert, Space, Typography } from "antd";
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

/**
 * Component hiển thị hướng dẫn sử dụng trang Settings
 * Đặt ở đầu SettingPage để user biết cách sử dụng
 */
export const ProfileInstructions = () => {
  return (
    <Space direction="vertical" style={{ width: "100%", marginBottom: 24 }}>
      <Alert
        message="📝 Hướng dẫn sử dụng"
        description={
          <Space direction="vertical" size={8}>
            <Text>
              <CheckCircleOutlined style={{ color: "#52c41a" }} /> Cập nhật thông tin cá nhân tại tab "Hồ sơ cá nhân"
            </Text>
            <Text>
              <CheckCircleOutlined style={{ color: "#52c41a" }} /> Đổi mật khẩu tại tab "Đổi mật khẩu"
            </Text>
            <Text>
              <CheckCircleOutlined style={{ color: "#52c41a" }} /> Xem lịch sử mua hàng tại tab "Lịch sử giao dịch"
            </Text>
          </Space>
        }
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        closable
      />
    </Space>
  );
};

/**
 * Component hiển thị thông báo khi chưa có email
 */
export const EmailWarning = ({ visible }) => {
  if (!visible) return null;

  return (
    <Alert
      message="⚠️ Chưa có email"
      description="Vui lòng cập nhật email để nhận thông báo quan trọng về đơn hàng và tài khoản."
      type="warning"
      showIcon
      icon={<WarningOutlined />}
      style={{ marginBottom: 16 }}
    />
  );
};

/**
 * Component hiển thị badge "Đã xác minh" cho các trường đã verify
 */
export const VerifiedBadge = () => {
  return (
    <span
      style={{
        marginLeft: 8,
        padding: "2px 8px",
        background: "#52c41a",
        color: "white",
        borderRadius: 4,
        fontSize: "0.75rem",
        fontWeight: "bold",
      }}
    >
      <CheckCircleOutlined /> Đã xác minh
    </span>
  );
};

/**
 * Component hiển thị trạng thái đồng bộ
 */
export const SyncStatus = ({ lastSynced }) => {
  if (!lastSynced) return null;

  const timeAgo = new Date(lastSynced).toLocaleString("vi-VN");

  return (
    <Text type="secondary" style={{ fontSize: "0.85rem" }}>
      Đồng bộ lần cuối: {timeAgo}
    </Text>
  );
};
