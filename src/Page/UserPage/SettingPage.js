import React, { useEffect, useState } from "react";
import { Input, DatePicker, Radio, Button, Upload, message, Form, notification } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { appService } from "../../service/appService";
import axios from "axios";
import { BASE_URL } from "../../service/config";
import { localUserService } from "../../service/localService";
import FancyLoadingPage from "../../Components/Spinner/FancyLoadingPage";


export default function SettingPage() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [userData, setUserData] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true)
    const fetchProfile = async () => {
      try {
        const res = await appService.getProfile();
        setUserData(res.data.metadata);
        form.setFieldsValue({
          ...res.data.metadata,
          dateOfBirth: res.data.metadata.dateOfBirth
            ? dayjs(res.data.metadata.dateOfBirth)
            : null,
        });
        setLoading(false)
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
        message.error("Không thể lấy dữ liệu người dùng.");
      }
    };

    fetchProfile();
  }, [form]); // Thêm form để đảm bảo dữ liệu cập nhật khi cần


  const uploadProps = {
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("Bạn chỉ có thể tải lên tệp JPG/PNG!");
        return Upload.LIST_IGNORE;
      }
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        message.error("Hình ảnh phải nhỏ hơn 1MB!");
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false;
    },
    fileList,
    onRemove: () => setFileList([]),
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning("Vui lòng chọn ảnh để tải lên");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileList[0]);

    try {
      const accessToken = localUserService.getAccessToken();
      await axios.put(
        `${BASE_URL}/user-service/api/v1/users/update-avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTimeout(() => {
        openNotification(
          "success",
          "Thành công",
          "Cập nhật avatar thành công!"
        );
      }, 500);
      setTimeout(() => {
        window.location.reload()
      }, 1200);
      setFileList([]);
    } catch (error) {
      console.error("Lỗi khi upload:", error);
      message.error("Có lỗi xảy ra khi cập nhật avatar.");
    }
  };

  

  const openNotification = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  const onFinish = async (values) => {
    try {
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.valueOf() : null, // Convert thành milliseconds
        avatar: fileList.length > 0 ? fileList[0] : userData?.avatar || null,
      };

      console.log("Dữ liệu cập nhật:", formattedValues);

      // Call update function
      await appService.updateProfile(formattedValues);
      setTimeout(() => {
        openNotification(
          "success",
          "Thành công",
          "Cập nhật thành công!"
        );
      }, 500);
      setTimeout(() => {
        window.location.reload()
      }, 1200);
    } catch (error) {
    
      console.error("Lỗi khi cập nhật người dùng:", error);
    }
  };

  return (
    <div style={{ padding: "2%" , background: 'white'}}>
      {contextHolder}
      {loading && (
        <FancyLoadingPage />
      )}
      <p style={{ fontSize: "30px" }}>Hồ sơ của tôi</p>
      <hr style={{ marginBottom: "5%" }} />
      <div style={{ display: "flex" }}>
        {userData && (
          <Form
            style={{ width: "50%", marginRight: "10%", textAlign: "end" }}
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
              }}
            >
              <p style={{ marginRight: "3%", fontSize: "16px" }}>Tên</p>
              <Form.Item style={{ width: "50%" }} name="firstName">
                <Input />
              </Form.Item>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
              }}
            >
              <p style={{ marginRight: "3%", fontSize: "16px" }}>Họ</p>
              <Form.Item style={{ width: "50%" }} name="lastName">
                <Input />
              </Form.Item>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
              }}
            >
              <p style={{ marginRight: "3%", fontSize: "16px" }}>
                Số điện thoại
              </p>
              <Form.Item style={{ width: "50%" }} name="phone">
                <Input />
              </Form.Item>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
              }}
            >
              <p style={{ marginRight: "3%", fontSize: "16px" }}>Ngày sinh</p>
              <Form.Item
                style={{ marginRight: "20%", width: "30%" }}
                name="dateOfBirth"
              >
                <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
              </Form.Item>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
              }}
            >
              <p style={{ marginRight: "3%", fontSize: "16px" }}>Giới tính</p>
              <Form.Item style={{ marginRight: "20%" }} name="gender">
                <Radio.Group>
                  <Radio value="MALE">Nam</Radio>
                  <Radio value="FEMALE">Nữ</Radio>
                  <Radio value="ORTHER">Khác</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            <Button
              style={{
                padding: "0 5%",
                fontSize: "18px",
                borderRadius: "20px",
                marginTop: "10%",
                background: "#6EB566",
                color: "white",
              }}
              htmlType="submit"
            >
              Lưu
            </Button>
          </Form>
        )}
        <div style={{ textAlign: "center"}}>
          {userData?.avatar ? (
            <img
              src={userData.avatar}
              alt="Avatar"
              style={{ width: "100px", height: "100px", borderRadius: "50%" , marginBottom: '10%'}}
            />
          ) : (
            <UserOutlined style={{ fontSize: "80px", color: "#bbb" }} />
          )}
          <br />
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
          <Button
            onClick={handleUpload}
            style={{ marginTop: "10px" }}
            type="primary"
          >
            Cập nhật Avatar
          </Button>
          <div style={{ lineHeight: "20%", marginTop: "10%" }}>
            <p>Dung lượng file tối đa 1MB</p>
            <p>Định dạng: JPEG, PNG</p>
          </div>
        </div>
      </div>
    </div>
  );
}
