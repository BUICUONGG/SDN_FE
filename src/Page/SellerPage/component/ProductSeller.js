import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Radio,
  Select,
  Switch,
} from "antd";
import React, { useEffect, useState } from "react";
import { BiSolidLeftArrow } from "react-icons/bi";
import { ImNotification } from "react-icons/im";
import { LiaSave } from "react-icons/lia";
import { Upload, Typography, Row, Col } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { IoWarningOutline } from "react-icons/io5";
import "./mainSel.css";
import SizeChartSelector from "./SizeChartSelector";
import { localUserService } from "../../../service/localService";
import { appService } from "../../../service/appService";
import axios from "axios";
import { BASE_URL } from "../../../service/config";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const options = ["100%", "95-99%", "90-94%", "85-89%", "80-84%"];

const uploadFields = [
  { key: "main", label: "Tải lên bản chính" },
  { key: "front", label: "Chính diện" },
  { key: "side", label: "Cạnh bên" },
  { key: "variant", label: "Biến thể" },
  { key: "size", label: "Kích thước &..." },
  { key: "angle", label: "Các góc độ" },
  { key: "usage", label: "Dạng sử dụng" },
  { key: "background", label: "Phối cảnh nền" },
  { key: "realphoto", label: "Ảnh chụp c..." },
];

export default function ProductSeller() {
  const [step, setStep] = useState(1);
  const [fileListMap, setFileListMap] = useState({});
  const [condition, setCondition] = useState();
  const [unit, setUnit] = useState("g");
  const [codEnabled, setCodEnabled] = useState(true);
  const [savedImages, setSavedImages] = useState([]);
  const [cate, setCate] = useState([]);
  const [brand, setBrand] = useState([]);
  const { Option, OptGroup } = Select;
  const [subCate, setSubCate] = useState([]);
  const [selectedCate, setSelectedCate] = useState(null);
  const [name, setName] = useState();
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [brandId, setBrandId] = useState(null);
  const [originalPrice, setOriginalPrice] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sizeChartData, setSizeChartData] = useState(null);
  const [ad1, setAd1] = useState();
  const [ad2, setAd2] = useState();
  const [ad3, setAd3] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (key, { fileList }) => {
    const isImage = fileList.every((file) =>
      ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
    );
    if (!isImage) {
      message.error("Chỉ chấp nhận file JPG, PNG!");
      return;
    }

    setFileListMap((prev) => {
      const newState = {
        ...prev,
        [key]: fileList.slice(-1), 
      };
      return newState;
    });
  };

  console.log(fileListMap);

  const handleParentChange = async (value) => {
    setSelectedCate(value);
    console.log(value);
    try {
      const res = await appService.getSubCate(value);
      console.log(res);
      setSubCate(res.data.metadata); 
    } catch (error) {
      console.error("Lỗi lấy danh mục con:", error);
    }
  };

  const deepFlatten = (arr) =>
    arr.reduce(
      (acc, val) =>
        Array.isArray(val) ? acc.concat(deepFlatten(val)) : acc.concat(val),
      []
    );

  const hkdStep1 = () => {
    const allFileWrappersNested = Object.values(fileListMap);

    const flatFileWrappers = deepFlatten(allFileWrappersNested);

    const images = flatFileWrappers
      .map((fileWrapper) => fileWrapper.originFileObj)
      .filter(Boolean);

    if (images.length < 5) {
      message.warning("Vui lòng tải lên ít nhất 5 ảnh.");
      return;
    }

    setSavedImages(images);

    setStep(2);
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await appService.getAllBrand();
        setBrand(res?.data?.metadata);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách brand:", err);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchCates = async () => {
      try {
        const res = await appService.getAllCate();
        setCate(res?.data?.metadata);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách brand:", err);
      }
    };

    fetchCates();
  }, []);

  const hkdStep2 = () => {
    if (step < 5) {
      setStep(3);
    }
  };

  const hkdStep3 = () => {
    if (step < 5) {
      setStep(4); 
    }
  };

  const hkdStep4 = async () => {
    const data = {
      name: name || "",
      description: "",
      story: "",
      saleStatus: "SELLING",
      origin: "vai",
      productDetails: {
        additionalProp1: ad1 || "",
        additionalProp2: ad2 || "",
        additionalProp3: ad3 || "",
      },
      brandId: Number(brandId) || 0,
      subcategory: Number(subCategory) || 0,
      requestType: "CREATE",
      variantRequestList: [
        {
          productSize: sizeChartData || "",
          quantity: Number(quantity) || 0,
          originalPrice: Number(originalPrice) || 0,
          resalePrice: Number(retailPrice) || 0,
          productCondition: "NEW",
        },
      ],
    };

    try {
      const res = await appService.postProduct(data);
      const productId = res?.data?.metadata;

      if (!productId) {
        message.error("Không thể lấy ID sản phẩm từ phản hồi.");
        return;
      }

      console.log("✅ Đã tạo sản phẩm, ID:", productId);

      const formData = new FormData();

      savedImages.forEach((file) => {
        formData.append("images", file);
      });

      setIsUploading(true);

      const response = await axios.post(
        `${BASE_URL}/product-service/api/v1/products/${productId}/upload_images`,
        formData,
        {
          params: { id: productId },
          headers: {
            Authorization: `Bearer ${localUserService.getAccessToken()}`, 
          },
        }
      );

      console.log(response);
      navigate("/seller-page/product");
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false); 
    }
  };


  console.log(localUserService.getAccessToken())
  const ProductCondition = ({ value, onChange }) => {
    return (
      <div style={{ width: "100%" }}>
        <Radio.Group
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            marginTop: 8,
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          {options.map((option) => {
            const isSelected = value === option;
            return (
              <Radio.Button
                key={option}
                value={option}
                style={{
                  marginRight: 8,
                  borderRadius: 6,
                  border: isSelected ? "2px solid #52c41a" : "1px solid #ccc",
                  color: isSelected ? "white" : "#389e0d",
                  fontWeight: "bold",
                  backgroundColor: isSelected ? "#52c41a" : "white",
                  width: "10%",
                  textAlign: "center",
                  fontSize: "16px",
                }}
              >
                {option}
              </Radio.Button>
            );
          })}
        </Radio.Group>
      </div>
    );
  };

  const handlePrev = () => {
    if (step < 5) {
      setStep(step - 1);
    }
  };

  const renderUploadItem = (key, label) => (
    <Col span={6} key={key}>
      <Upload
        listType="picture-card"
        fileList={fileListMap[key] || []}
        onChange={(info) => handleChange(key, info)}
        beforeUpload={() => false} // không upload lên server
        maxCount={1}
      >
        {(fileListMap[key] || []).length >= 1 ? null : (
          <div style={{ textAlign: "center" }}>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>{label}</div>
          </div>
        )}
      </Upload>
    </Col>
  );

  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  return (
    <div
      style={{
        // height: "90vh",
        padding: "10px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          background: "#fff",
          padding: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "5px",
        }}
      >
        <div>
          <BiSolidLeftArrow /> Trở lại
        </div>
        <div>
          <button
            style={{
              border: "none",
              padding: "5px 10px",
              borderRadius: "10px",
              background: "#f0f0f0",
            }}
          >
            <LiaSave /> Lưu bản nháp
          </button>
          <button
            style={{
              border: "none",
              padding: "5px 20px",
              borderRadius: "10px",
              background: "#6EB566",
              marginLeft: "10px",
              color: "#fff",
            }}
          >
            Gửi xét duyệt
          </button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            width: "95%",
          }}
        >
          <div
            style={{
              width: "100%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              borderRadius: "5px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              marginBottom: "2%",
              height: "7vh",
              overflow: "hidden",
              margin: "1% 0",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "100%",
                backgroundColor: "#6EB566",
                marginRight: "10px",
              }}
            ></span>
            <ImNotification
              style={{
                color: "#6EB566",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                color: "#000",
                marginLeft: "10px",
              }}
            >
              Đơn đăng ký của bạn hiện đang trong quá trình xét duyệt. Sản phẩm
              của bạn sẽ hiển thị với khách hàng sau khi hoàn tất xác minh. Cảm
              ơn bạn đã kiên nhẫn chờ đợi!
            </span>
          </div>
          <div
            style={{
              width: "100%",
              padding: "15px",
              background: "#fff",
            }}
          >
            {/* navbar chuyen tab */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0 35%",
                position: "relative",
              }}
            >
              <span
                className={`progress-bar-item ${
                  step >= 1 ? "active-bar" : ""
                } `}
              >
                1
              </span>
              <hr
                className={`hr-bar ${step >= 1 ? "active-hr" : ""} ${
                  step >= 2 ? "actived-hr" : ""
                }`}
              />
              <span
                className={`progress-bar-item ${step >= 2 ? "active-bar" : ""}`}
              >
                2
              </span>
              <hr
                className={`hr-bar-2 ${step >= 2 ? "active-hr" : ""} ${
                  step >= 3 ? "actived-hr" : ""
                }`}
              />
              <span
                className={`progress-bar-item ${step >= 3 ? "active-bar" : ""}`}
              >
                3
              </span>
              <hr
                className={`hr-bar-3 ${step >= 3 ? "active-hr" : ""} ${
                  step >= 4 ? "actived-hr" : ""
                }`}
              />
              <span
                className={`progress-bar-item-last ${
                  step >= 4 ? "active-bar" : ""
                }`}
              >
                4
              </span>
            </div>

            {step === 1 && (
              <div style={{ padding: "3%" }}>
                <Title level={3} style={{ textAlign: "center" }}>
                  Thông tin cơ bản
                </Title>
                <Text strong>* Hình ảnh sản phẩm</Text>
                <br />
                <Text>
                  Bạn nên thêm ít nhất 5 ảnh để thể hiện sản phẩm đầy đủ.
                </Text>

                {/* Ảnh chính riêng và nổi bật */}
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      marginTop: 20,
                      border: "2px dashed #ccc",
                      borderRadius: 10,
                      padding: 10,
                      textAlign: "center",
                      width: "20%",
                      marginRight: "1%",
                    }}
                  >
                    <div>
                      <Upload
                        listType="picture-card"
                        fileList={fileListMap["main"] || []}
                        onChange={(info) => handleChange("main", info)}
                        beforeUpload={() => false}
                        maxCount={1}
                      >
                        {(fileListMap["main"] || []).length >= 1 ? null : (
                          <div>
                            <UploadOutlined style={{ fontSize: 36 }} />
                          </div>
                        )}
                      </Upload>
                      <div style={{ marginTop: 12, fontSize: 16 }}>
                        Tải lên bản chính
                      </div>
                      <div style={{ fontSize: 12, color: "#999" }}>
                        Kích thước: 600 x 600 px
                        <br />
                        Dung lượng tối đa: 5MB
                        <br />
                        Định dạng: JPG, JPEG, PNG
                      </div>
                    </div>
                  </div>

                  {/* Các ảnh phụ */}
                  <div
                    style={{
                      width: "45%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                      {uploadFields
                        .filter((field) => field.key !== "main")
                        .map((field) =>
                          renderUploadItem(field.key, field.label)
                        )}
                    </Row>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "5px",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                    marginBottom: "2%",
                    height: "5vh",
                    overflow: "hidden",
                    margin: "2% 0",
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "100%",
                      backgroundColor: "#6EB566",
                      marginRight: "10px",
                    }}
                  ></span>
                  <ImNotification
                    style={{
                      color: "#6EB566",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#000",
                      marginLeft: "10px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "600",
                      }}
                    >
                      Số lượng hình ảnh
                    </span>{" "}
                    - Thêm ít nhất 5 ảnh để minh họa đầy đủ cho sản phẩm của bạn
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    background: "#B9F3B3",
                    borderRadius: "5px",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                    marginBottom: "2%",
                    overflow: "hidden",
                    margin: "2% 0",
                    padding: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        width: "5px",
                        height: "100%",
                        backgroundColor: "#6EB566",
                        marginRight: "10px",
                      }}
                    ></span>
                    <IoWarningOutline
                      style={
                        {
                          // color: "#6EB566",
                        }
                      }
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#000",
                        marginLeft: "10px",
                      }}
                    >
                      Ảnh bạn tải lên không đạt yêu cầu hiển thị trên sàn:
                    </span>
                  </div>{" "}
                  <br />
                  <p>+ Ảnh mờ hoặc thiếu ánh sáng</p>
                  <p>+ Ảnh mờ hoặc thiếu ánh sáng</p>
                  <p>+ Ảnh mờ hoặc thiếu ánh sáng</p>
                  <p>
                    Vui lòng chọn ảnh rõ nét, đủ ánh sáng, sản phẩm chiếm phần
                    lớn khung hình để tăng cơ hội bán hàng. Ảnh đạt chất lượng
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "5%",
                  }}
                >
                  <div style={{ width: "10%" }}>
                    <Button
                      style={{
                        outline: "none",
                        border: "none",
                      }}
                    >
                      Hủy bỏ
                    </Button>
                  </div>
                  <div style={{ width: "10%", textAlign: "right" }}>
                    <Button
                      onClick={hkdStep1}
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
              </div>
            )}

            {step === 2 && (
              <div style={{ padding: "3%" }}>
                <Title level={3} style={{ textAlign: "center" }}>
                  Thông tin cơ bản
                </Title>

                {/* Tên sản phẩm */}
                <Text strong>* Tên sản phẩm</Text>
                <br />
                <Text style={{ opacity: "0.6" }}>
                  Độ dài đề xuất: 40 ký tự trở lên. Hạng mục sẽ được tự động xác
                  định theo tên sản phẩm.
                </Text>
                <Input
                  style={{ margin: "1% 0" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="[Thương hiệu] + [Nội dung] + [Phạm vi áp dụng] + [Loại sản phẩm] + [Chức năng / Tính năng]"
                />

                {/* Danh mục cha */}
                <Text strong>* Hạng mục</Text>
                <br />
                <Text style={{ opacity: "0.6" }}>
                  Các bài niêm yết sản phẩm bị chia sai danh mục, bị cấm hoặc bị
                  hạn chế có thể sẽ bị xóa.
                </Text>
                <Select
                  style={{ width: "100%", margin: "1% 0 0 0" }}
                  showSearch
                  placeholder="Chọn danh mục"
                  value={category}
                  onChange={(value) => {
                    setCategory(value);
                    setSubCategory(null); // reset danh mục con khi đổi danh mục cha
                    handleParentChange(value);
                  }}
                  optionLabelProp="label"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {cate.map((parent) => (
                    <OptGroup key={parent.id} label={parent.name}>
                      {parent.children.map((child) => (
                        <Option
                          key={child.id}
                          value={child.id}
                          label={child.name}
                        >
                          {child.name}
                        </Option>
                      ))}
                    </OptGroup>
                  ))}
                </Select>

                {/* Danh mục con */}
                <Select
                  style={{ width: "100%", marginTop: "2%" }}
                  placeholder={
                    category
                      ? "Chọn danh mục con"
                      : "Vui lòng chọn danh mục cha trước"
                  }
                  value={subCategory}
                  onChange={(value) => setSubCategory(value)}
                  disabled={!category}
                >
                  {subCate.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>

                {/* Thông báo */}
                <div
                  style={{
                    width: "100%",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "5px",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                    margin: "2% 0",
                    height: "5vh",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "100%",
                      backgroundColor: "#6EB566",
                      marginRight: "10px",
                    }}
                  ></span>
                  <ImNotification style={{ color: "#6EB566" }} />
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#000",
                      marginLeft: "10px",
                    }}
                  >
                    Vui lòng kiểm tra kỹ xem sản phẩm có nằm trong đúng hạng mục
                    cấp 1&2&3 không
                  </span>
                </div>

                {/* Thương hiệu */}
                <Text strong>* Thương hiệu</Text>
                <br />
                <Text style={{ opacity: "0.6" }}>
                  Các bài niêm yết sản phẩm bị chia sai danh mục, bị cấm hoặc bị
                  hạn chế có thể sẽ bị xóa.
                </Text>
                <Select
                  style={{ width: "100%", margin: "1% 0 0 0" }}
                  showSearch
                  placeholder="Chọn thương hiệu"
                  value={brandId}
                  onChange={(value) => setBrandId(value)}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={brand.map((b) => ({ value: b.id, label: b.name }))}
                />

                {/* Thông báo lặp lại */}
                <div
                  style={{
                    width: "100%",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "5px",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                    margin: "2% 0",
                    height: "5vh",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "100%",
                      backgroundColor: "#6EB566",
                      marginRight: "10px",
                    }}
                  ></span>
                  <ImNotification style={{ color: "#6EB566" }} />
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#000",
                      marginLeft: "10px",
                    }}
                  >
                    Vui lòng kiểm tra kỹ xem sản phẩm có nằm trong đúng hạng mục
                    cấp 1&2&3 không
                  </span>
                </div>

                {/* Nút điều hướng */}
                <div style={{ display: "flex", marginTop: "5%" }}>
                  <div style={{ width: "80%", textAlign: "left" }}>
                    <Button
                      onClick={handlePrev}
                      style={{
                        background: "none",
                        color: "black",
                        border: "none",
                      }}
                    >
                      Quay lại
                    </Button>
                  </div>
                  <div style={{ width: "10%" }}>
                    <Button style={{ border: "none" }}>Hủy bỏ</Button>
                  </div>
                  <div style={{ width: "10%", textAlign: "right" }}>
                    <Button
                      onClick={hkdStep2}
                      style={{
                        background: "#6EB566",
                        color: "white",
                        border: "none",
                      }}
                      htmlType="submit"
                    >
                      Tiếp Theo
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ padding: "3%" }}>
                <Title level={3} style={{ textAlign: "center" }}>
                  Thông tin bán hàng
                </Title>
                <Text>* Tình trạng</Text>
                <br />
                <Text strong> Mới 100%:</Text>
                <Text>
                  {" "}
                  Chưa qua sử dụng, còn nguyên tag/tem, bao bì đầy đủ.
                </Text>
                <br />
                <Text strong> Như mới (95-99%):</Text>
                <Text>
                  {" "}
                  Đã sử dụng rất ít, không có dấu hiệu hao mòn rõ rệt. Vẫn còn
                  rất mới và sạch sẽ.
                </Text>
                <br />
                <Text strong> Gần như mới (90-94%):</Text>
                <Text>
                  Có thể có vết xước nhẹ, nhưng tổng thể vẫn rất đẹp, không ảnh
                  hưởng đến trải nghiệm sử dụng.
                </Text>
                <br />
                <Text strong> Đẹp (85-89%):</Text>
                <Text>
                  Có dấu hiệu đã sử dụng (xước nhẹ, phai màu nhẹ), nhưng tổng
                  thể vẫn sạch, không rách hay lỗi lớn.
                </Text>
                <br />
                <Text strong> Tốt (80-84%):</Text>
                <Text>
                  Có vài điểm hao mòn rõ (xù vải, sờn nhẹ, phai màu), nhưng
                  không rách, không lỗi kỹ thuật. Dùng ổn định.
                </Text>
                <br />
                <br />
                <Text>* Chọn tình trạng sản phẩm</Text>
                <br />
                <ProductCondition value={condition} onChange={setCondition} />
                <div
                  style={{
                    width: "100%",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "5px",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                    marginBottom: "2%",
                    height: "6vh",
                    overflow: "hidden",
                    margin: "2% 0",
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "100%",
                      backgroundColor: "#6EB566",
                      marginRight: "10px",
                    }}
                  ></span>
                  <ImNotification
                    style={{
                      color: "#6EB566",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      color: "red",
                      marginLeft: "10px",
                    }}
                  >
                    Vui lòng kiểm tra kỹ tình trạng sản phẩm trước khi đăng bán.
                    Mô tả trung thực, rõ ràng giúp tránh khiếu nại, hoàn hàng và
                    giữ uy tín cho shop. Hình ảnh thực tế và ghi chú rõ lỗi (nếu
                    có) sẽ giúp khách yên tâm hơn khi mua!
                  </span>
                </div>
                <Text strong>Bật biến thể</Text>{" "}
                <Switch size="small" defaultChecked onChange={onChange} />
                <br />
                <Text
                  style={{
                    opacity: "0.6",
                    marginLeft: "1%",
                  }}
                >
                  Bạn có thể thêm biến thể nếu sản phẩm này cí nhiều lựa chọn,
                  như kích cỡ hoặc màu sắc.
                </Text>{" "}
                <br />
                <Text>* Giá và hàng có sẵn</Text>
                <Form
                  style={{
                    border: "1px solid black",
                    borderRadius: "10px",
                    padding: "2% 1%",
                    margin: "2% 0",
                  }}
                  layout="vertical"
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        label={<Text strong>* Giá gốc</Text>}
                        name="originalPrice"
                        rules={[
                          { required: true, message: "Vui lòng nhập giá gốc" },
                        ]}
                      >
                        <Input
                          prefix="đ"
                          placeholder="Giá gốc"
                          value={originalPrice}
                          onChange={(e) => setOriginalPrice(e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label={<Text strong>* Giá bán lẻ</Text>}
                        name="retailPrice"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập giá bán lẻ",
                          },
                        ]}
                      >
                        <Input
                          prefix="đ"
                          placeholder="Giá bán lẻ"
                          value={retailPrice}
                          onChange={(e) => setRetailPrice(e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label={<Text strong>* Số lượng</Text>}
                        name="quantity"
                        rules={[
                          { required: true, message: "Vui lòng nhập số lượng" },
                        ]}
                      >
                        <Input
                          placeholder="Số lượng"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
                <Text>* Bảng kích cỡ</Text>
                <SizeChartSelector
                  onChange={(data) => {
                    setSizeChartData(data.customTemplateString);
                    console.log(
                      "Dữ liệu từ form chính:",
                      data.customTemplateString
                    );
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    marginTop: "5%",
                  }}
                >
                  <div style={{ width: "80%", textAlign: "left" }}>
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
                  <div style={{ width: "10%" }}>
                    <Button
                      style={{
                        outline: "none",
                        border: "none",
                      }}
                    >
                      Hủy bỏ
                    </Button>
                  </div>
                  <div style={{ width: "10%", textAlign: "right" }}>
                    <Button
                      onClick={hkdStep3}
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
              </div>
            )}

            {step === 4 && (
              <div style={{ padding: "3%" }}>
                <Title level={3} style={{ textAlign: "center" }}>
                  Thông tin bán hàng
                </Title>

                <p style={{ fontSize: "24px" }}>Vận chuyển</p>

                <Form layout="vertical">
                  {/* Trọng lượng */}
                  <Form.Item
                    label={<Text strong>Trọng lượng khi đã đóng gói</Text>}
                    required
                  >
                    <Input
                      addonBefore={
                        <Select
                          defaultValue="g"
                          onChange={(value) => setUnit(value)}
                        >
                          <Select.Option value="g">Gram (g)</Select.Option>
                          <Select.Option value="kg">
                            Kilogram (kg)
                          </Select.Option>
                        </Select>
                      }
                      placeholder="Nhập trọng lượng sản phẩm"
                      type="number"
                    />
                  </Form.Item>

                  {/* Kích thước kiện hàng */}
                  <Form.Item label={<Text strong>Kích thước kiện hàng</Text>}>
                    <Text type="secondary">
                      Đảm bảo trọng lượng và kích thước hợp lý để tính phí vận
                      chuyển và phương thức vận chuyển.
                    </Text>
                    <Row gutter={16} style={{ marginTop: 8 }}>
                      <Col span={8}>
                        <Form.Item name="height">
                          <Input
                            suffix="cm"
                            placeholder="Chiều cao"
                            value={ad1}
                            onChange={(e) => setAd1(e.target.value)}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="width">
                          <Input
                            suffix="cm"
                            placeholder="Chiều rộng"
                            value={ad2}
                            onChange={(e) => setAd2(e.target.value)}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="length">
                          <Input
                            suffix="cm"
                            placeholder="Chiều dài"
                            value={ad3}
                            onChange={(e) => setAd3(e.target.value)}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>

                  {/* Cách vận chuyển */}
                  <Form.Item label={<Text strong>* Cách vận chuyển</Text>}>
                    <p>Phí vận chuyển ước tính: --</p>
                    <Text type="secondary">
                      Phí vận chuyển sẽ được ước tính dựa trên trọng lượng và
                      kích thước sản phẩm.
                    </Text>
                  </Form.Item>

                  {/* Thanh toán khi nhận hàng */}
                  <span>Thanh toán khi nhận hàng </span>
                  <Switch
                    size="small"
                    checked={codEnabled}
                    onChange={setCodEnabled}
                  />

                  <Divider />

                  {/* Footer Buttons */}
                  <div
                    style={{
                      display: "flex",
                      marginTop: "5%",
                    }}
                  >
                    <div style={{ width: "80%", textAlign: "left" }}>
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
                    <div style={{ width: "10%" }}>
                      <Button
                        style={{
                          outline: "none",
                          border: "none",
                        }}
                      >
                        Lưu nháp
                      </Button>
                    </div>
                    <div style={{ width: "10%", textAlign: "right" }}>
                      <Button
                        onClick={hkdStep4}
                        loading={isUploading}
                        style={{
                          background: "#6EB566",
                          color: "white",
                          outline: "none",
                        }}
                        htmlType="submit"
                      >
                        {isUploading ? "Đang gửi..." : "Gửi xét duyệt"}
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            width: "15%",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "10px 20px",
            }}
          >
            <p
              style={{
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "500",
                marginBottom: "1%",
              }}
            >
              Đề xuất
            </p>
            <p
              style={{
                padding: "0 10%",
                fontSize: "10px",
                marginTop: 0,
                marginLeft: "2%",
              }}
            >
              Thông tin sản phẩm đầy đủ có thể giúp tăng mức độ hiển thị sản
              phẩm của bạn.
            </p>
            <p
              style={{
                textAlign: "center",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Thông tin cơ bản
            </p>
            <p
              style={{
                fontSize: "12px",
                fontWeight: "500",
                marginBottom: "1%",
              }}
            >
              Hình ảnh sản phẩm
            </p>
            <li
              style={{
                fontSize: "12px",
                marginLeft: "25%",
              }}
            >
              có ít hơn 5 ảnh sản phẩm
            </li>
            <p
              style={{
                fontSize: "12px",
                fontWeight: "500",
                marginBottom: "1%",
              }}
            >
              Tên sản phẩm
            </p>
            <li
              style={{
                fontSize: "12px",
                marginLeft: "25%",
              }}
            >
              Tên sản phẩm ít hơn 40 ký tự.
            </li>
            <p
              style={{
                fontSize: "12px",
                fontWeight: "500",
                marginBottom: "1%",
              }}
            >
              Hạng mục
            </p>
            <li
              style={{
                fontSize: "12px",
                marginLeft: "25%",
              }}
            >
              Hạng mục cấp 1&2&3 cần được kiểm tra lại
            </li>
            <p
              style={{
                fontSize: "12px",
                fontWeight: "500",
                marginBottom: "1%",
              }}
            >
              Thông tin sản phẩm
            </p>
            <p
              style={{
                fontSize: "12px",
                fontWeight: "500",
                marginTop: "40%",
              }}
            >
              Vận chuyển
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
