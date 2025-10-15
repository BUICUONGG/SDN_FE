import {
  Radio,
  Upload,
  Select,
  Typography,
  Form,
  Modal,
  Input,
  Space,
  Button,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Text } = Typography;

const SizeChartSelector = ({ onChange }) => {
  const [mode, setMode] = useState("template");
  const [templates, setTemplates] = useState(["Nam"]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [mainForm] = Form.useForm(); // Form chính

  const handleModeChange = (e) => {
    const newMode = e.target.value;
    setMode(newMode);
    mainForm.setFieldsValue({ mode: newMode });
    triggerChange();
  };

  const handleAddTemplate = () => {
    form.validateFields().then((values) => {
      const newTemplateName = values.chartName;
      if (newTemplateName && !templates.includes(newTemplateName)) {
        setTemplates([...templates, newTemplateName]);
      }

      // 👉 Tạo chuỗi string thủ công
      const sizeRows = values.sizes
        ?.map((s) => `${s.size}-${s.chest}-${s.waist}`)
        .join(", ");

      const customString =
        `Tên bảng: ${values.chartName || ""} + ` +
        `Tùy chọn: ${values.customLabel || ""} + ` +
        `Hệ đo: ${values.conversion || ""} + ` +
        `Lưu ý: ${values.note || ""} + ` +
        `Kích cỡ: ${sizeRows || ""}`;

      // Gửi chuỗi lên component cha
      onChange?.({
        ...mainForm.getFieldsValue(),
        customTemplateString: customString,
      });

      mainForm.setFieldsValue({
        sizeChartTemplate: newTemplateName,
      });

      setModalVisible(false);
      form.resetFields();
    });
  };

  const triggerChange = () => {
    const values = mainForm.getFieldsValue();
    onChange?.(values);
  };

  return (
    <Form form={mainForm} layout="vertical" onValuesChange={triggerChange}>
      <Form.Item name="mode" initialValue={mode} style={{ display: "none" }} />
      <Form.Item label={<Text strong>* Bảng kích cỡ</Text>} required>
        <Radio.Group onChange={handleModeChange} value={mode}>
          <Radio value="template">Sử dụng mẫu</Radio>
          <Radio value="upload">Tải ảnh lên</Radio>
        </Radio.Group>

        {mode === "template" && (
          <Form.Item
            name="sizeChartTemplate"
            rules={[
              { required: true, message: "Vui lòng chọn mẫu biểu đồ kích cỡ" },
            ]}
            style={{ marginTop: 8 }}
          >
            <Select
              placeholder="Chọn mẫu biểu đồ kích cỡ"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: 8,
                      cursor: "pointer",
                    }}
                    onClick={() => setModalVisible(true)}
                  >
                    <PlusOutlined style={{ marginRight: 8 }} />
                    Tạo mẫu mới
                  </div>
                </>
              )}
            >
              {templates.map((t) => (
                <Select.Option key={t} value={t}>
                  {t}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {mode === "upload" && (
          <Form.Item
            name="sizeChartImage"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[
              { required: true, message: "Vui lòng tải ảnh bảng kích cỡ" },
            ]}
            style={{ marginTop: 16 }}
          >
            <Upload
              name="sizeChart"
              listType="picture-card"
              beforeUpload={() => false}
              accept="image/*"
              maxCount={1}
            >
              <div>
                <UploadOutlined />
                <div>Hình ảnh</div>
              </div>
            </Upload>
          </Form.Item>
        )}
      </Form.Item>

      {/* Modal tạo mẫu mới */}
      <Modal
        title="Tạo mẫu mới"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleAddTemplate}
        okText="Thêm"
        cancelText="Hủy"
        width={700}
      >
        <Form form={form} layout="vertical">
          <div
            style={{
              borderBottom: "1px solid #ddd",
              marginBottom: 16,
              paddingBottom: 16,
            }}
          >
            <Text>
              Điền thông tin kích cỡ để cung cấp biểu đồ kích cỡ cho khách hàng.{" "}
              <span style={{ color: "#6EB566" }}>Xem cách hiển thị</span>
            </Text>
            <div style={{ padding: "2%" }}>
              <Typography.Title level={5}>
                Bước 1: Chọn thông tin
              </Typography.Title>
              <Form.Item
                name="chartName"
                label="Tên biểu đồ kích cỡ"
                rules={[
                  { required: true, message: "Vui lòng nhập tên biểu đồ" },
                ]}
              >
                <Input placeholder="Nhập dữ liệu" />
              </Form.Item>
              <Form.Item name="customLabel" label="Tùy chọn">
                <Input placeholder="Nhập dữ liệu" />
              </Form.Item>
              <Form.Item name="conversion" label="Quy đổi kích thước">
                <Select placeholder="Chọn hệ đo">
                  <Select.Option value="US">US</Select.Option>
                  <Select.Option value="UK">UK</Select.Option>
                  <Select.Option value="EU">EU</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="note" label="Lưu ý">
                <Input.TextArea rows={2} placeholder="Nhập dữ liệu" />
              </Form.Item>
            </div>
          </div>

          <Typography.Title level={5}>
            Bước 2: Điền bảng kích thước
          </Typography.Title>
          <Form.List name="sizes" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "size"]}
                      rules={[{ required: true, message: "Kích cỡ?" }]}
                    >
                      <Input placeholder="Kích cỡ" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "chest"]}
                      rules={[{ required: true, message: "Ngực?" }]}
                    >
                      <Input placeholder="Vòng ngực (cm)" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "waist"]}
                      rules={[{ required: true, message: "Eo?" }]}
                    >
                      <Input placeholder="Eo (cm)" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm hàng
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </Form>
  );
};

export default SizeChartSelector;
