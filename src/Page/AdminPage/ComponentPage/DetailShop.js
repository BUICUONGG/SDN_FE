import React, { useEffect, useState } from "react";
import { Input, Select, Button, message, notification } from "antd";
import { appService } from "../../../service/appService";
import { useNavigate, useParams } from "react-router-dom";

const { TextArea } = Input;

export default function DetailShop() {
  const { id } = useParams();
  const [stores, setStores] = useState([]);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const openNotification = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  useEffect(() => {
    appService
      .getDetailStore(id)
      .then((res) => {
        console.log(res?.data?.metadata);
        setStores(res?.data?.metadata);
        setStatus(res?.data?.metadata?.verificationStatus || "PENDING");
      })
      .catch((err) => {
        console.error("Error fetching stores:", err);
        setStores([]);
      });
  }, [id]);

  const handleSave = async () => {
    try {
      await appService.updateStoreStatus(id, {
        reason: reason || "Không có lời nhắn",
        verificationStatus: status.toUpperCase(),
      });
      openNotification("success", "Thành công", "Đổi trạng thái thành công");
      setTimeout(() => {
        navigate("/admin-page/store");
      }, 1500);
    } catch (err) {
      console.log(err.response);
      const errorMeta = err.response?.data?.metadata;
      let errorMessage = "";
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
    }
  };

  const statusOptions = [
    { value: "PENDING", label: "Chờ xét duyệt" },
    { value: "VERIFIED", label: "Xác thực" },
    { value: "REJECTED", label: "Từ chối" },
    { value: "SUSPENDED", label: "Cấm" },
    { value: "NEED_MORE_INFO", label: "Cần thêm thông tin" },
  ];

  const filteredOptions =
    status === "VERIFIED"
      ? statusOptions.filter((option) => option.value !== "PENDING")
      : statusOptions;

  return (
    <div style={{ padding: "5%", background: "rgb(247, 247, 247)" , minHeight: "100vh" }}>
      {/* Header */}
      {contextHolder}
      <div style={{ display: "flex", marginBottom: "30px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            objectFit: "cover",
            marginRight: "20px",
            background: "#6EB566",
          }}
        ></div>

        <div style={{ width: "50%" }}>
          <h2 style={{ margin: 0 }}>HTT04</h2>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <p>Họ & tên:</p>
              <p>Số CCCD:</p>
              <p>Số điện thoại:</p>
              <p>Email:</p>
              <p>Hạng mục sản phẩm:</p>
              <p>Mô tả cửa hàng:</p>
              <p>Hình chụp của CCCD:</p>
            </div>
            <div>
              <p>{stores?.nameOwner}</p>
              <p>{stores?.identityNumber}</p>
              <p>{stores?.phone}</p>
              <p>{stores?.email}</p>
              <p>{stores?.category || "chưa có"}</p>
              <p>{stores?.description || "chưa có"}</p>
              <p>
                <img
                  src={stores?.frontIdentityNumber}
                  alt="front"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "10px",
                  }}
                />
                <img
                  src={stores?.backIdentityNumber}
                  alt="back"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "10px",
                    marginLeft: "10px",
                  }}
                />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Message & Actions */}
      <div>
        <TextArea
          rows={4}
          placeholder="Lời nhắn..."
          style={{ marginBottom: "20px" }}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          <Select
            value={status}
            onChange={(value) => setStatus(value)}
            options={filteredOptions}
            style={{ width: 180 }}
          />

          <Button
            type="primary"
            style={{ background: "#6EB566", borderColor: "#6EB566" }}
            onClick={handleSave}
          >
            Lưu
          </Button>
        </div>
      </div>
    </div>
  );
}
