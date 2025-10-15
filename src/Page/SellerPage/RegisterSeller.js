import React, { use, useEffect, useState } from "react";
import "./RegisterSeller.css";
import { Checkbox, Form, Input, Button, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import AddAddressRegister from "../../Components/AddAddrassModal/AddAddressRegister";
import { localUserService } from "../../service/localService";
import axios from "axios";
import { BASE_URL } from "../../service/config";
import { FaCheckCircle } from "react-icons/fa";
import { appService } from "../../service/appService";
import { useNavigate } from "react-router-dom";

export default function RegisterSeller() {
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState("");
  const [shopName, setShopName] = useState("");
  const [location, setLocation] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState(null);
  const [isModalAdd2, setIsModalAdd2] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => {
    setBusinessType(e.target.value); // Chỉ chọn một loại hình kinh doanh
    setStep(1);
  };

  console.log(localUserService.getAccessToken());

  const handleStep1 = (values) => {
    setShopName(values.shopName);
    setDescription(values.description);
    if (step < 5) {
      setStep(2);
    }
  };
  const handleStep2 = (values) => {
    setOwnerName(values.ownerName);
    setIdentityNumber(values.identityNumber);
    if (step < 5) {
      setStep(3);
    }
  };

  const openAddressModal2 = () => {
    setIsModalAdd2(true);
  };
  const closeAddressModal2 = () => {
    setIsModalAdd2(false);
  };

  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataCate, setDataCate] = useState([]);
  const [end, setEnd] = useState(false);

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
      await axios.post(
        `${BASE_URL}/store-service/api/v1/stores/upload_identity`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
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
  const handleUpload2 = async () => {
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
      await axios.post(
        `${BASE_URL}/store-service/api/v1/stores/upload_identity`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setEnd(true);
      setFrontFile(null);
      setBackFile(null);
    } catch (err) {
      console.error(err);
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

  const handleStep3 = async (values) => {
    const accessToken = localUserService.getAccessToken();

    const dataForm = {
      shopName: shopName || "",
      location: selectedAddress,
      identityNumber: identityNumber || "",
      ownerName: ownerName || "",
      businessType: "INDIVIDUAL",
      email: email || "",
      description: description || "",
      phone: phone || "",
      category: 0,
      taxCode: "1111",
    };

    try {
      const res = await axios.post(
        `${BASE_URL}/store-service/api/v1/stores/register`,
        dataForm,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Tạo cửa hàng thành công:", res.data);
    } catch (error) {
      console.log("Lỗi tạo cửa hàng:", error.response?.data || error.message);
    }

    if (step < 5) {
      setStep(4);
    }
  };

  const handlePrev = () => {
    if (step < 5) {
      setStep(step - 1);
    }
    setSelectedAddress(null);
    setIsModalAdd2(false);
  };

  const handleSaveAddress = (address) => {
    setSelectedAddress(address); // Lưu địa chỉ vào state
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const handleFinish = async (values) => {
    await handleStep3(values);
    handleUpload(); // Đợi upload xong (nếu cần)
  };

  // Gọi API để lấy danh sách category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await appService.getAllCate();
        console.log("Danh sách danh mục:", response.data.metadata);
        setDataCate(response.data.metadata);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  // hộ kinhh doanh
  const hkdStep1 = (values) => {
    setShopName(values.shopName);
    setDescription(values.description);
    setCategory(values.category);
    if (step < 5) {
      setStep(2);
    }
  };

  const hkdStep2 = (values) => {
    setPhone(values.phone);
    setEmail(values.email);
    if (step < 5) {
      setStep(3);
    }
  };
  const hkd3 = async (values) => {
    const accessToken = localUserService.getAccessToken();

    const dataForm = {
      shopName: shopName || "",
      location: selectedAddress,
      identityNumber: values.identityNumber || "",
      ownerName: values.ownerName || "",
      businessType: businessType,
      email: email || "",
      description: description || "",
      phone: phone || "",
      category: category || 0,
      taxCode: values.taxCode || "",
    };

    try {
      const res = await axios.post(
        `${BASE_URL}/store-service/api/v1/stores/register`,
        dataForm,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Tạo cửa hàng thành công:", res.data);
    } catch (error) {
      console.log("Lỗi tạo cửa hàng:", error.response?.data || error.message);
    }

    if (step < 5) {
      setStep(4);
      // setEnd(true);
    }
  };

  return (
    <div
      style={{
        padding: "1% 0",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          fontFamily: "inter",
          textAlign: "center",
          marginBottom: "2%",
        }}
      >
        Đăng ký bán hàng với Xmark
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 35%",
          position: "relative",
        }}
      >
        <span className={`progress-bar-item ${step >= 1 ? "active-bar" : ""} `}>
          1
        </span>
        <hr
          className={`hr-bar ${step >= 1 ? "active-hr" : ""} ${
            step >= 2 ? "actived-hr" : ""
          }`}
        />
        <span className={`progress-bar-item ${step >= 2 ? "active-bar" : ""}`}>
          2
        </span>
        <hr
          className={`hr-bar-2 ${step >= 2 ? "active-hr" : ""} ${
            step >= 3 ? "actived-hr" : ""
          }`}
        />
        <span className={`progress-bar-item ${step >= 3 ? "active-bar" : ""}`}>
          3
        </span>
        <hr
          className={`hr-bar-3 ${step >= 3 ? "active-hr" : ""} ${
            step >= 4 ? "actived-hr" : ""
          }`}
        />
        <span
          className={`progress-bar-item-last ${step >= 4 ? "active-bar" : ""}`}
        >
          4
        </span>
      </div>
      <div
        style={{
          marginTop: "4%",
        }}
      >
        {/* step 1 */}
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <label style={{ fontSize: "20px", marginRight: "3%" }}>
              Loại hình kinh doanh
            </label>
            <div className="checkbox-group">
              {["INDIVIDUAL", "BUSINESS", "cty"].map((type, index) => (
                <Checkbox
                  key={index}
                  value={type}
                  checked={businessType === type}
                  onChange={onChange}
                  style={{
                    fontSize: "20px",
                    marginRight: "30px",
                  }}
                >
                  {type === "INDIVIDUAL"
                    ? "Cá nhân"
                    : type === "BUSINESS"
                    ? "Hộ kinh doanh"
                    : "Công ty"}
                </Checkbox>
              ))}
            </div>
          </div>
          {businessType === "BUSINESS" && (
            <span style={{ fontSize: "11px" }}>
              Loại hình kinh doanh sẽ ảnh hưởng đến thông tin bạn cần điền
            </span>
          )}

          <div
            style={{
              padding: "3% 30%",
            }}
          >
            {businessType === "BUSINESS" && step === 1 && (
              <span style={{ fontSize: "14px" }}>
                Tên cửa hàng không được có từ “Flagship’’ hoặc ‘’Official’’,
                không được chỉ là các chữ số, không được chứa ký tự đặc hay ký
                tự lạ nào ngoại trừ ký tự tiếng Anh.
              </span>
            )}

            {/* INDIVIDUAL step-1 */}
            {businessType === "INDIVIDUAL" && step === 1 && (
              <Form
                name="wrap"
                labelCol={{
                  flex: "110px",
                }}
                labelAlign="left"
                onFinish={handleStep1}
                labelWrap
                wrapperCol={{
                  flex: 1,
                }}
                colon={false}
                style={{
                  maxWidth: 600,
                  padding: "0 5%",
                }}
              >
                <span style={{ fontSize: "11px" }}>
                  Địa chỉ này sẽ được sử dụng để lấy/trả hàng khi có đơn hoàn
                  hoặc đổi trả. Hãy nhập chính xác để đảm bảo quá trình vận
                  chuyển diễn ra thuận lợi.
                </span>
                <div
                  style={{
                    textAlign: "left",
                  }}
                >
                  <span style={{ marginLeft: "10%", marginRight: "2%" }}>
                    Địa chỉ{" "}
                  </span>
                  <Button
                    onClick={openAddressModal2}
                    style={{
                      background: "none",
                      color: "black",
                      outline: "none",
                    }}
                  >
                    Chọn địa chỉ
                  </Button>
                  {selectedAddress !== null && (
                    <Button
                      style={{
                        background: "none",
                        color: "black",
                        outline: "none",
                        marginLeft: "3%",
                        opacity: "0.5",
                      }}
                    >
                      {selectedAddress.length > 20
                        ? selectedAddress.substring(0, 46) + "..."
                        : selectedAddress}
                    </Button>
                  )}
                </div>

                <Form.Item
                  style={{
                    marginTop: "10% ",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <div style={{ width: "60%", textAlign: "left" }}>
                      <Button
                        onClick={handlePrev}
                        style={{
                          background: "none",
                          color: "black",
                          outline: "none",
                          border: "none",
                        }}
                      >
                        Quay lại
                      </Button>
                    </div>
                    <div style={{ width: "20%" }}>
                      <Button
                        style={{
                          outline: "none",
                          border: "none",
                        }}
                      >
                        Hủy bỏ
                      </Button>
                    </div>
                    <div style={{ width: "20%", textAlign: "right" }}>
                      <Button
                        style={{
                          background: "#6EB566",
                          color: "white",
                          outline: "none",
                        }}
                        htmlType="submit"
                      >
                        Tiếp Theo
                      </Button>
                    </div>
                  </div>
                </Form.Item>
              </Form>
            )}

            <AddAddressRegister
              isOpen={isModalAdd2}
              onClose={closeAddressModal2}
              onSaveAddress={handleSaveAddress}
            />

            {/* INDIVIDUALh step-2 */}
            {businessType === "INDIVIDUAL" && step === 2 && (
              <Form
                name="wrap"
                labelCol={{
                  flex: "110px",
                }}
                labelAlign="left"
                onFinish={handleStep2}
                labelWrap
                wrapperCol={{
                  flex: 1,
                }}
                colon={false}
                style={{
                  maxWidth: 600,
                  marginTop: "20px",
                  padding: "0 5%",
                }}
              >
                <div
                  style={{
                    textAlign: "left",
                    marginBottom: "5%",
                  }}
                >
                  <span style={{ marginLeft: "0%", marginRight: "7%" }}>
                    Hình thức định danh{" "}
                  </span>
                  <span>CCCD</span>
                </div>
                <Form.Item
                  label="Số CCCD"
                  name="identityNumber"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Họ & Tên"
                  name="ownerName"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  style={{
                    marginTop: "10% ",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <div style={{ width: "60%", textAlign: "left" }}>
                      <Button
                        onClick={handlePrev}
                        style={{
                          background: "none",
                          color: "black",
                          outline: "none",
                          border: "none",
                        }}
                      >
                        Quay lại
                      </Button>
                    </div>
                    <div style={{ width: "20%" }}>
                      <Button
                        style={{
                          outline: "none",
                          border: "none",
                        }}
                      >
                        Hủy bỏ
                      </Button>
                    </div>
                    <div style={{ width: "20%", textAlign: "right" }}>
                      <Button
                        style={{
                          background: "#6EB566",
                          color: "white",
                          outline: "none",
                        }}
                        htmlType="submit"
                      >
                        Tiếp Theo
                      </Button>
                    </div>
                  </div>
                </Form.Item>
              </Form>
            )}

            {/* INDIVIDUALh step-3 */}
            {businessType === "INDIVIDUAL" && step === 3 && (
              <Form
                name="wrap"
                labelCol={{ flex: "110px" }}
                labelAlign="left"
                onFinish={handleFinish}
                labelWrap
                wrapperCol={{ flex: 1 }}
                colon={false}
                style={{ maxWidth: 600, padding: "0 5%" }}
              >
                {/* PHẦN CCCD */}
                <Form.Item style={{ marginTop: 24 }}>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: "400",
                        color: "black",
                        width: "40%",
                      }}
                    >
                      Hình chụp CCCD
                    </p>
                    <div>
                      <div className="upload-container">
                        <UploadBox file={frontFile} side="front" />
                        <UploadBox file={backFile} side="back" />
                      </div>
                      <p
                        className="note"
                        style={{ fontSize: "12px", marginTop: 8 }}
                      >
                        Vui lòng cung cấp ảnh chụp CCCD/CMND/Hộ chiếu của bạn.
                        Thông tin phải hiển thị rõ ràng (kích thước ảnh không
                        vượt quá 5 MB).
                      </p>
                    </div>
                  </div>
                </Form.Item>

                {/* Nút điều hướng */}
                <Form.Item style={{ marginTop: "10%" }}>
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "60%", textAlign: "left" }}>
                      <Button
                        onClick={handlePrev}
                        style={{
                          background: "none",
                          color: "black",
                          outline: "none",
                          border: "none",
                        }}
                      >
                        Quay lại
                      </Button>
                    </div>
                    <div style={{ width: "20%" }}>
                      <Button
                        style={{
                          outline: "none",
                          border: "none",
                        }}
                      >
                        Hủy bỏ
                      </Button>
                    </div>
                    <div style={{ width: "20%", textAlign: "right" }}>
                      <Button
                        style={{
                          background: "#6EB566",
                          color: "white",
                          outline: "none",
                        }}
                        htmlType="submit"
                      >
                        Tiếp Theo
                      </Button>
                    </div>
                  </div>
                </Form.Item>
              </Form>
            )}

            {/* INDIVIDUALh step-4 */}
            {businessType === "INDIVIDUAL" && step === 4 && (
              <div>
                <FaCheckCircle
                  style={{
                    color: "#6EB566",
                    fontSize: "100px",
                    marginBottom: "5%",
                    marginTop: "5%",
                  }}
                />
                <h1>Đăng ký thành công!</h1>
                <p style={{ color: "black", fontWeight: "400" }}>
                  Đơn đăng ký của bạn đã được gửi. Vui lòng chờ trong vòng 72
                  giờ để duyệt
                </p>
                <button
                  onClick={() => navigate("/seller-page")}
                  style={{
                    padding: "2% 10%",
                    background: "#6EB566",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "16px",
                    marginTop: "20%",
                    marginBottom: "20%",
                  }}
                >
                  xác nhận
                </button>
              </div>
            )}

            {/* BUSINESS - step 1 */}
            {businessType === "BUSINESS" && step === 1 && (
              <Form
                name="wrap"
                labelCol={{
                  flex: "110px",
                }}
                labelAlign="left"
                labelWrap
                onFinish={hkdStep1}
                wrapperCol={{
                  flex: 1,
                }}
                colon={false}
                style={{
                  maxWidth: 600,
                  marginTop: "20px",
                  padding: "0 5%",
                }}
              >
                <Form.Item
                  label="Tên cửa hàng"
                  name="shopName"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Mô tả"
                  name="description"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>
                <span style={{ fontSize: "14px" }}>
                  Chọn hạng mục sản phẩm bạn định bán. Thông tin hạng mục bạn
                  điền ở đây sẽ không ảnh hưởng đến việc tải lên sản phẩm.
                </span>
                <Form.Item
                  label="Hạng mục sản phẩm"
                  name="category"
                  rules={[
                    { required: true, message: "Vui lòng chọn hạng mục!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn hạng mục"
                    options={dataCate.map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  style={{
                    marginLeft: "65%",
                    marginTop: "10% ",
                  }}
                >
                  <Button>Hủy bỏ</Button>
                  <Button
                    style={{
                      marginLeft: "10%",
                      background: "#6EB566",
                      color: "white",
                    }}
                    htmlType="submit"
                  >
                    Tiếp theo
                  </Button>
                </Form.Item>
              </Form>
            )}

            {/* BUSINESS - step 2 */}
            {businessType === "BUSINESS" && step === 2 && (
              <Form
                name="wrap"
                labelCol={{
                  flex: "110px",
                }}
                labelAlign="left"
                onFinish={hkdStep2}
                labelWrap
                wrapperCol={{
                  flex: 1,
                }}
                colon={false}
                style={{
                  maxWidth: 600,
                  padding: "0 5%",
                }}
              >
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Địa chỉ email"
                  name="email"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <span style={{ fontSize: "11px" }}>
                  Địa chỉ này sẽ được sử dụng để lấy/trả hàng khi có đơn hoàn
                  hoặc đổi trả. Hãy nhập chính xác để đảm bảo quá trình vận
                  chuyển diễn ra thuận lợi.
                </span>
                <div
                  style={{
                    textAlign: "left",
                  }}
                >
                  <span style={{ marginLeft: "10%", marginRight: "2%" }}>
                    Địa chỉ{" "}
                  </span>
                  <Button
                    onClick={openAddressModal2}
                    style={{
                      background: "none",
                      color: "black",
                      outline: "none",
                    }}
                  >
                    Chọn địa chỉ
                  </Button>
                  {selectedAddress !== null && (
                    <Button
                      style={{
                        background: "none",
                        color: "black",
                        outline: "none",
                        marginLeft: "3%",
                        opacity: "0.5",
                      }}
                    >
                      {selectedAddress.length > 20
                        ? selectedAddress.substring(0, 46) + "..."
                        : selectedAddress}
                    </Button>
                  )}
                </div>

                <Form.Item
                  style={{
                    marginTop: "10% ",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <div style={{ width: "60%", textAlign: "left" }}>
                      <Button
                        onClick={handlePrev}
                        style={{
                          background: "none",
                          color: "black",
                          outline: "none",
                          border: "none",
                        }}
                      >
                        Quay lại
                      </Button>
                    </div>
                    <div style={{ width: "20%" }}>
                      <Button
                        style={{
                          outline: "none",
                          border: "none",
                        }}
                      >
                        Hủy bỏ
                      </Button>
                    </div>
                    <div style={{ width: "20%", textAlign: "right" }}>
                      <Button
                        style={{
                          background: "#6EB566",
                          color: "white",
                          outline: "none",
                        }}
                        htmlType="submit"
                      >
                        Tiếp Theo
                      </Button>
                    </div>
                  </div>
                </Form.Item>
              </Form>
            )}

            {/* BUSINESS - step 3 */}
            {businessType === "BUSINESS" && step === 3 && (
              <Form
                name="wrap"
                labelCol={{
                  flex: "110px",
                }}
                labelAlign="left"
                onFinish={hkd3}
                labelWrap
                wrapperCol={{
                  flex: 1,
                }}
                colon={false}
                style={{
                  maxWidth: 600,
                  marginTop: "20px",
                  padding: "0 5%",
                }}
              >
                <div
                  style={{
                    textAlign: "left",
                    marginBottom: "5%",
                  }}
                >
                  <span style={{ marginLeft: "0%", marginRight: "7%" }}>
                    Hình thức định danh{" "}
                  </span>
                  <span>CCCD</span>
                </div>
                <Form.Item
                  label="Số CCCD"
                  name="identityNumber"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Họ & Tên"
                  name="ownerName"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="May số thuế"
                  name="taxCode"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  style={{
                    marginTop: "10% ",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <div style={{ width: "60%", textAlign: "left" }}>
                      <Button
                        onClick={handlePrev}
                        style={{
                          background: "none",
                          color: "black",
                          outline: "none",
                          border: "none",
                        }}
                      >
                        Quay lại
                      </Button>
                    </div>
                    <div style={{ width: "20%" }}>
                      <Button
                        style={{
                          outline: "none",
                          border: "none",
                        }}
                      >
                        Hủy bỏ
                      </Button>
                    </div>
                    <div style={{ width: "20%", textAlign: "right" }}>
                      <Button
                        style={{
                          background: "#6EB566",
                          color: "white",
                          outline: "none",
                        }}
                        htmlType="submit"
                      >
                        Tiếp Theo
                      </Button>
                    </div>
                  </div>
                </Form.Item>
              </Form>
            )}
            {/* BUSINESS - step 4 */}
            {businessType === "BUSINESS" && step === 4 && !end && (
              <Form
                name="wrap"
                labelCol={{ flex: "110px" }}
                labelAlign="left"
                onFinish={handleUpload2}
                labelWrap
                wrapperCol={{ flex: 1 }}
                colon={false}
                style={{ maxWidth: 600, padding: "0 5%" }}
              >
                {/* PHẦN CCCD */}
                <Form.Item style={{ marginTop: 24 }}>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: "400",
                        color: "black",
                        width: "40%",
                      }}
                    >
                      Hình chụp CCCD
                    </p>
                    <div>
                      <div className="upload-container">
                        <UploadBox file={frontFile} side="front" />
                        <UploadBox file={backFile} side="back" />
                      </div>
                      <p
                        className="note"
                        style={{ fontSize: "12px", marginTop: 8 }}
                      >
                        Vui lòng cung cấp ảnh chụp CCCD/CMND/Hộ chiếu của bạn.
                        Thông tin phải hiển thị rõ ràng (kích thước ảnh không
                        vượt quá 5 MB).
                      </p>
                    </div>
                  </div>
                </Form.Item>

                {/* Nút điều hướng */}
                <Form.Item style={{ marginTop: "10%" }}>
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "60%", textAlign: "left" }}>
                      <Button
                        onClick={handlePrev}
                        style={{
                          background: "none",
                          color: "black",
                          outline: "none",
                          border: "none",
                        }}
                      >
                        Quay lại
                      </Button>
                    </div>
                    <div style={{ width: "20%" }}>
                      <Button
                        style={{
                          outline: "none",
                          border: "none",
                        }}
                      >
                        Hủy bỏ
                      </Button>
                    </div>
                    <div style={{ width: "20%", textAlign: "right" }}>
                      <Button
                        style={{
                          background: "#6EB566",
                          color: "white",
                          outline: "none",
                        }}
                        htmlType="submit"
                      >
                        Tiếp Theo
                      </Button>
                    </div>
                  </div>
                </Form.Item>
              </Form>
            )}

            {/* BUSINESS - end */}
            {businessType === "BUSINESS" && step === 4 && end && (
              <div>
                <FaCheckCircle
                  style={{
                    color: "#6EB566",
                    fontSize: "100px",
                    marginBottom: "5%",
                    marginTop: "5%",
                  }}
                />
                <h1>Đăng ký thành công!</h1>
                <p style={{ color: "black", fontWeight: "400" }}>
                  Đơn đăng ký của bạn đã được gửi. Vui lòng chờ trong vòng 72
                  giờ để duyệt
                </p>
                <button
                  onClick={() => navigate("/seller-page")}
                  style={{
                    padding: "2% 10%",
                    background: "#6EB566",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "16px",
                    marginTop: "20%",
                    marginBottom: "20%",
                  }}
                >
                  xác nhận
                </button>
              </div>
            )}


            {businessType === "cty" && <h1>3</h1>}
            {/* {businessType === "" && (
              <Form
                name="wrap"
                labelCol={{
                  flex: "110px",
                }}
                labelAlign="left"
                labelWrap
                wrapperCol={{
                  flex: 1,
                }}
                colon={false}
                style={{
                  maxWidth: 600,
                  marginTop: "20px",
                  padding: "0 5%",
                }}
              >
                <Form.Item
                  label="Tên cửa hàng"
                  name="username"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Địa chỉ email"
                  name="email"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  style={{
                    marginLeft: "65%",
                    marginTop: "10% ",
                  }}
                >
                  <Button>Hủy bỏ</Button>
                  <Button style={{ marginLeft: "10%" }} htmlType="submit">
                    Tiếp theo
                  </Button>
                </Form.Item>
              </Form>
            )} */}
            
          </div>
        </div>
      </div>
    </div>
  );
}
