import React from "react";
import { Form, Input, Button, Typography, notification } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { appService } from "../../service/appService";

const { Title, Text } = Typography;

export default function ChangePass() {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };
  const onFinish = (values) => {
    console.log("Form values:", values);
    const data = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    };
    console.log(data);
    const res = appService.changePw(data);
    res
      .then((res) => {
        console.log(res);
        openNotification("success", "Thành công", "Đổi mật khẩu thành công");
      })
      .catch((err) => {
        console.log(err.response.data.metadata);
        const errorMeta = err.response?.data?.metadata;
        let errorMessage = '';
        if (Array.isArray(errorMeta)) {
          errorMessage = errorMeta.map((item) => item.message).join("\n");
        } else if (typeof errorMeta === "object" && errorMeta?.message) {
          errorMessage = errorMeta.message;
        } else if (typeof errorMeta === "string") {
          errorMessage = errorMeta;
        } else {
          errorMessage = "Đã xảy ra lỗi không xác định";
        }

        openNotification("error", "Thất bại", errorMessage);
      });
  };

  return (
    <div
      style={{
        width: "100%",
        background: "white",
        height: "100%",
      }}
    >
      {contextHolder}
      <div style={{ background: "white", padding: "3% 5%", width: "100%" }}>
        <p
          style={{
            fontSize: "24px",
            fontWeight: "400",
            marginBottom: "16px",
          }}
        >
          Đổi mật khẩu
        </p>
        <Text type="secondary">
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </Text>
        <hr style={{ margin: "16px 0" }} />

        <Form layout="vertical" style={{ width: "40%" }} onFinish={onFinish}>
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu cũ"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <Input.Password
              placeholder="Mật khẩu mới"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            label="Xac nhận mật khẩu"
            name="confirmPassword"
            rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}
          >
            <Input.Password
              placeholder="Xác nhận mật khẩu"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#52c41a",
                borderColor: "#52c41a",
                marginTop: 16,
              }}
            >
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
