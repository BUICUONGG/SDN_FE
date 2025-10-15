import { Input, Row, Col, Typography, Form } from 'antd';

const { Text } = Typography;

const ProductPriceForm = () => {
  return (
    <Form style={{
      border: '1px solid black',
      borderRadius: '10px',
      padding: '2% 1%',
      margin: '2% 0'
    }} layout="vertical">
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label={<Text strong>* Giá gốc</Text>}
            name="originalPrice"
            rules={[{ required: true, message: 'Vui lòng nhập giá gốc' }]}
          >
            <Input prefix="đ" placeholder="Giá gốc" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={<Text strong>* Giá bán lẻ</Text>}
            name="retailPrice"
            rules={[{ required: true, message: 'Vui lòng nhập giá bán lẻ' }]}
          >
            <Input prefix="đ" placeholder="Giá bán lẻ" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={<Text strong>* Số lượng</Text>}
            name="quantity"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
          >
            <Input placeholder="Số lượng" type="number" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default ProductPriceForm;
