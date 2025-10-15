import React, { useState } from "react";
import axios from "axios";
import "./IdentityUpload.css"; // Import CSS styles
import { BASE_URL } from "../../service/config";
import { localUserService } from "../../service/localService";

export default function IdentityUpload() {
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /** kiểm tra, lưu file */
  const onSelectFile = (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh không được vượt quá 5 MB!");
      return;
    }
    side === "front" ? setFrontFile(file) : setBackFile(file);
  };

  /** gọi API */
  const handleUpload = async () => {
    const accessToken = localUserService.getAccessToken();
    if (!frontFile || !backFile) {
      alert("Vui lòng chọn đủ 2 mặt CCCD trước khi gửi.");
      return;
    }

    const formData = new FormData();
    formData.append("frontIdentity", frontFile);
    formData.append("backIdentity", backFile);

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/store-service/api/v1/stores/upload_identity`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${accessToken}` },
      });
      alert("Tải ảnh CCCD thành công!");
      setFrontFile(null);
      setBackFile(null);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  /** UI hiển thị từng ô upload */
  const UploadBox = ({ file, side }) => (
    <label className="upload-box">
      {file ? (
        /* xem trước ảnh */
        <img src={URL.createObjectURL(file)} alt={side} />
      ) : (
        <span className="upload-plus">+</span>
      )}

      <span className="upload-caption">
        {side === "front" ? "Mặt trước" : "Mặt sau"}
      </span>

      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => onSelectFile(e, side)}
      />
    </label>
  );

  return (
    <div>
        <div className="identity-wrapper">
            <p className="title">Hình chụp CCCD</p>

            <div>
                <div className="upload-container">
                    <UploadBox file={frontFile} side="front" />
                    <UploadBox file={backFile} side="back" />
                </div>

                <p className="note">
                    Vui lòng cung cấp ảnh chụp CCCD/CMND/Hộ chiếu của bạn. Thông tin phải
                    hiển thị rõ ràng (kích thước ảnh không vượt quá 5 MB).
                </p>
            </div>
        </div>

            <button
                className="btn-upload"
                onClick={handleUpload}
                disabled={loading}
            >
                {loading ? "Đang tải..." : "Xác nhận"}
            </button>
    </div>
  );
}
