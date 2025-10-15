import React, { useState } from "react";
import { Modal, Form, Input, Row, Col, Alert } from "antd";

export default function ChinhSachmodal({ visible, onCancel, onOk }) {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [ten, setTen] = useState("");
  const [moTa, setMoTa] = useState("");

  const handleSubmit = () => {
    console.log("Tên:", ten);
    console.log("Mô tả:", moTa);
    // Gửi dữ liệu lên server tại đây (nếu cần)
    setIsOpen(false); // Đóng modal
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Chính sách gợi ý dành cho shop:"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      okText="Lưu"
      cancelText="Hủy bỏ"
      okButtonProps={{ style: { backgroundColor: "#6EB566", border: "none" } }}
    >
      <hr />
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "10%",
        }}
      >
        <div
          style={{
            width: "70%",
          }}
        >
          <p
            style={{
              color: "black",
              fontWeight: "400",
              margin: "0",
            }}
          >
            1. Chính sách giặt ủi:
          </p>
          <span style={{ fontSize: "12px" }}>
            ♻️ Tất cả sản phẩm được giặt sạch, khử khuẩn và kiểm tra kỹ trước
            khi giao đến tay khách hàng.
          </span>
        </div>
        <div
          style={{
            width: "30%",
          }}
        >
          <span
            style={{
              background: "#E0E0E0",
              padding: "1%",
              borderRadius: "10px",
            }}
          >
            <button
              style={{
                border: "none",
                background: "none",
              }}
            >
              Có
            </button>
            |
            <button
              style={{
                border: "none",
                background: "none",
              }}
            >
              Không
            </button>
          </span>
        </div>
      </div>
      <hr />
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "10%",
        }}
      >
        <div
          style={{
            width: "70%",
          }}
        >
          <p
            style={{
              color: "black",
              fontWeight: "400",
              margin: "0",
            }}
          >
            2. Cam kết chất lượng sản phẩm:
          </p>
          <span style={{ fontSize: "12px" }}>
            🧵 Shop cam kết mô tả đúng tình trạng thực tế của sản phẩm (mới bao
            nhiêu %, còn tốt hay có lỗi nhỏ, nếu có sẽ ghi rõ).
          </span>
        </div>
        <div
          style={{
            width: "30%",
          }}
        >
          <span
            style={{
              background: "#E0E0E0",
              padding: "1%",
              borderRadius: "10px",
            }}
          >
            <button
              style={{
                border: "none",
                background: "none",
              }}
            >
              Có
            </button>
            |
            <button
              style={{
                border: "none",
                background: "none",
              }}
            >
              Không
            </button>
          </span>
        </div>
      </div>
      <hr />
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "10%",
        }}
      >
        <div
          style={{
            width: "70%",
          }}
        >
          <p
            style={{
              color: "black",
              fontWeight: "400",
              margin: "0",
            }}
          >
            3. Cam kết hình ảnh:
          </p>
          <span style={{ fontSize: "12px" }}>
            📸 Tất cả hình ảnh do shop tự chụp, phản ánh đúng sản phẩm thật.
          </span>
        </div>
        <div
          style={{
            width: "30%",
          }}
        >
          <span
            style={{
              background: "#E0E0E0",
              padding: "1%",
              borderRadius: "10px",
            }}
          >
            <button
              style={{
                border: "none",
                background: "none",
              }}
            >
              Có
            </button>
            |
            <button
              style={{
                border: "none",
                background: "none",
              }}
            >
              Không
            </button>
          </span>
        </div>
      </div>
      <hr />
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "10%",
        }}
      >
        <div
          style={{
            width: "70%",
          }}
        >
          <p
            style={{
              color: "black",
              fontWeight: "400",
              margin: "0",
            }}
          >
            4. Chính sách đổi trả:
          </p>
          <span style={{ fontSize: "12px" }}>
            🔁 Shop hỗ trợ đổi trả trong vòng ___ ngày kể từ khi nhận hàng nếu
            sản phẩm khác mô tả, lỗi nghiêm trọng hoặc không đúng mẫu đã đặt.
          </span>
        </div>
        <div
          style={{
            width: "30%",
          }}
        >
          <span
            style={{
              background: "#E0E0E0",
              padding: "1%",
              borderRadius: "10px",
            }}
          >
            <button
              style={{
                border: "none",
                background: "none",
              }}
            >
              Có
            </button>
            |
            <button
              style={{
                border: "none",
                background: "none",
              }}
            >
              Không
            </button>
          </span>
        </div>
      </div>
      <hr />
      <div
        style={{
          textAlign: "end",
        }}
      >
        <button
          style={{
            border: "1px solid black",
            padding: "1%",
            color: "#388B2F",
            borderRadius: "5px",
          }}
          onClick={() => setIsOpen(true)}
        >
          Thêm chính sách
        </button>
        {isOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                width: "400px",
              }}
            >
              <input
                type="text"
                value={ten}
                placeholder="Tên chính sách"
                onChange={(e) => setTen(e.target.value)}
                style={{ width: "100%", marginBottom: "10px" ,
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: '1px solid black'
                }}
              />
              <textarea
                value={moTa}
                placeholder="mô tả chi tiết chính sách"
                onChange={(e) => setMoTa(e.target.value)}
                style={{ width: "100%", marginBottom: "10px",
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: '1px solid black'
                 }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button style={{
                    border: 'none',
                    padding: '0 5%',
                    background: '#E0E0E0',
                    color: 'black',
                    borderRadius: '5px'
                }}  onClick={() => setIsOpen(false)}>Hủy</button>
                <button style={{
                    border: 'none',
                    padding: '0 5%',
                    background: '#6EB566',
                    color: 'white',
                    borderRadius: '5px'
                }} onClick={handleSubmit}>Lưu</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
