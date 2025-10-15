import { Button, Input, Space } from "antd";
import React, { useState, useRef } from "react";
import { FaCommentDots } from "react-icons/fa";

export default function ChatBox() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({
    left: window.innerWidth - 70,
    top: window.innerHeight - 70,
  });

  const dataChat = [
    {
      id: 1,
      message: "Xin chào!",
      role: "user",
    },
    {
      id: 2,
      message: "Chào bạn!",
      role: "admin",
    },
    {
      id: 3,
      message: "Bạn có cần giúp gì không?",
      role: "admin",
    },
    {
      id: 4,
      message: "Tôi muốn hỏi về sản phẩm này.",
      role: "user",
    },
  ]


  const boxRef = useRef();

  const onMouseDown = (e) => {
    e.stopPropagation(); // Ngăn việc click mở hộp chat nếu đang kéo

    const box = boxRef.current;
    const startX = e.clientX - position.left;
    const startY = e.clientY - position.top;

    const onMouseMove = (e) => {
      const newLeft = e.clientX - startX;
      const newTop = e.clientY - startY;

      setPosition({ left: newLeft, top: newTop });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onDoubleClick = () => {
    setVisible(true);
  };

  const topParam = position.top - 350;
  const leftParam = position.left - 570;

  return (
    <>
      {/* Nút mở chat */}
      {!visible && (
        <div
          ref={boxRef}
          onMouseDown={onMouseDown}
          onDoubleClick={onDoubleClick}
          style={{
            position: "fixed",
            left: `${position.left}px`,
            top: `${position.top}px`,
            width: "50px",
            height: "50px",
            background: "linear-gradient(135deg, #a8e063, #56ab2f)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            cursor: "move",
            zIndex: 999,
            userSelect: "none",
          }}
        >
          <FaCommentDots color="#fff" size={24} />
        </div>
      )}

      {/* Hộp chat */}
      {visible && (
        <div
          ref={boxRef}
          onMouseDown={onMouseDown}
          style={{
            position: "fixed",
            left: `${leftParam}px`,
            top: `${topParam}px`,
            width: "40%",
            height: "400px",
            backgroundColor: "#6EB566",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            cursor: "move",
            zIndex: 1000,
            userSelect: "none",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              padding: "10px",
              backgroundColor: "#6EB566",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "move",
            }}
          >
            <span style={{ fontSize: "32px" }}>Chat</span>
            <button
              onClick={() => setVisible(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontWeight: "500",
                fontSize: "32px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
          <div
            style={{ padding: "0 5px", display: "flex", alignItems: "center" }}
          >
            <div
              style={{
                height: "320px",
                backgroundColor: "#fff",
                width: "30%",
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
              }}
            ></div>
            <div
              style={{
                height: "320px",
                backgroundColor: "#fff",
                width: "70%",
                marginLeft: "1%",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                position: "relative",
                padding: "10px",
              }}
            >
              {/* show chat ra day */}
              {dataChat.map((item) => (
                <p
                key={item.id}
                style={{
                    textAlign: item.role === "admin" ? 'left' : 'right' ,
                }}
              >
                <span
                    style={{
                        color: "black",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                        padding: "5px 10px",
                        borderRadius: "10px",
                        fontWeight: '500'
                      }}
                >
                    {item.message}
                </span>
              </p>
              ))}
              

              <div
                style={{
                  position: "absolute",
                  bottom: "2%",
                  left: "2%",
                  width: "95%",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                }}
              >
                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    placeholder="Nhập nội dung"
                    style={{
                      backgroundColor: "#D1D1D1",
                    }}
                  />
                  <Button
                    style={{
                      backgroundColor: "#6EB566",
                      color: "#fff",
                      outline: "none",
                    }}
                  >
                    Gửi
                  </Button>
                </Space.Compact>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
