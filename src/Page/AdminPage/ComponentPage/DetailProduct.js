import React, { useEffect, useState } from "react";
import {
  Input,
  Select,
  Button,
  notification,
  Modal,
  Image,
} from "antd";
import { appService } from "../../../service/appService";
import { useNavigate, useParams } from "react-router-dom";
import { localUserService } from "../../../service/localService";

const { TextArea } = Input;

export default function DetailProduct() {
  const { id } = useParams();
  const [stores, setStores] = useState([]);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("pending");
  const [api, contextHolder] = notification.useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openNotification = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  console.log(localUserService.getAccessToken())

  useEffect(() => {
    appService
      .getDetailProduct(id)
      .then((res) => {
        setStores(res?.data?.metadata);
      })
      .catch((err) => {
        console.error("Error fetching stores:", err);
        setStores([]);
      });
  }, [id]);

  const handleSave = async () => {
    try {
      await appService.updateProductStatus(id, {
        reasonReject: reason || "Không có lời nhắn",
        productApprovalStatus: status.toUpperCase(),
      });
      
      openNotification("success", "Thành công", "Đổi trạng thái thành công");
      setTimeout(() => {
        navigate("/admin-page/posts");
      }, 1500);
    } catch (err) {
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

  return (
    <div style={{ padding: "5%", background: "rgb(247, 247, 247)", minHeight: "100vh" }}>
      {contextHolder}

      {/* Header */}
      <div style={{ display: "flex", marginBottom: "30px", gap: "2%" }}>
        {/* Ảnh đại diện */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            marginRight: "20px",
            background: "#6EB566",
          }}
        >
          {/* Bấm vào ảnh đại diện sẽ mở modal chứa nhiều ảnh */}
          <img
            src={stores?.productImageUrl?.[0]}
            alt="product"
            onClick={handleOpenModal}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "10px",
              objectFit: "cover",
              cursor: "pointer",
            }}
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div style={{ width: "50%" }}>
          <h2 style={{ margin: 0 }}>{stores.productName}</h2>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <p>Tình trạng :</p>
              <p>Hạng mục :</p>
              <p>Số lượng :</p>
              <p>Size :</p>
              <p>Giá gốc :</p>
              <p>Giá bán :</p>
              <p>Mô tả :</p>
            </div>
            <div>
              <p>{stores?.productApprovalStatus}</p>
              <p>{stores?.productSubCategory}</p>
              <p>
                {stores?.productVariants?.[0]?.quantity ?? "Không có dữ liệu"}
              </p>
              <p>
                {stores?.productVariants?.[0]?.size
                  ?.split("+")
                  ?.find((item) => item.includes("Kích cỡ"))
                  ?.split(":")[1]
                  ?.trim() || "Không có dữ liệu"}
              </p>
              <p>{stores?.productVariants?.[0]?.originalPrice ?? "chưa có"}</p>
              <p>{stores?.productVariants?.[0]?.resalePrice ?? "chưa có"}</p>
              <p>{stores?.productDescription ?? "chưa có"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xem ảnh */}
      <Modal
        title="Tất cả ảnh sản phẩm"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <Image.PreviewGroup>
            {stores?.productImageUrl?.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`product-${index}`}
                width={100}
                height={100}
                style={{
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            ))}
          </Image.PreviewGroup>
        </div>
      </Modal>

      {/* Lý do & nút xác nhận */}
      <div>
        <TextArea
            disabled={stores?.productApprovalStatus === "APPROVED"}
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
            disabled={stores?.productApprovalStatus === "APPROVED"}
            value={status}
            onChange={(value) => setStatus(value)}
            options={[
              { value: "APPROVED", label: "XÉT DUYỆT" },
              { value: "REJECT", label: "TỪ CHỐI" },
            ]}
            style={{ width: 180 }}
          />
          <Button
            disabled={stores?.productApprovalStatus === "APPROVED"}
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
