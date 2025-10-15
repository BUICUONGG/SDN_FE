import React, { useEffect, useState, useRef } from "react";
import "./ChatPage.css";
import { RiRobot2Line } from "react-icons/ri";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default function ChatPage() {
  const [content, setContent] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Tạo session_id khi mở trang
  useEffect(() => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
  }, []);

  // Scroll tới dòng cuối khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [content]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (showIntro) {
      setShowIntro(false);
    }

    const userMessage = { id: Date.now(), content: input, sender: "user" };
    setContent((prev) => [...prev, userMessage]);
    setInput("");

    const loadingMessageId = Date.now() + 1;
    const thinkingMessage = {
      id: loadingMessageId,
      content: "thinking...",
      sender: "bot-loading",
    };
    setContent((prev) => [...prev, thinkingMessage]);
    setLoading(true);

    try {
      const res = await axios.post(
        "https://e_commerce_ai_dev.truong51972.id.vn/api/ai_agent",
        {
          session_id: sessionId,
          user_id: "2",
          messages: input,
        }
      );

      const updatedBotMessage = {
        id: loadingMessageId,
        content: res.data.messages,
        sender: "bot",
      };

      setContent((prev) =>
        prev.map((msg) => (msg.id === loadingMessageId ? updatedBotMessage : msg))
      );
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2% 3%", display: "flex" }}>
      <div
        style={{
          height: "70vh",
          padding: "2%",
          width: "30%",
          textAlign: "center",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p style={{ color: "black", fontSize: 36 }}>
            <RiRobot2Line />
          </p>
          {showIntro && (
            <p style={{ color: "black", fontSize: 22, margin: 0 }}>
              Xin chào, tôi là Trợ lý Xmark! Hôm nay tôi có thể giúp bạn khám
              phá những món đồ tuyệt vời như thế nào?
            </p>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            maxHeight: "50vh",
          }}
        >
          {/* Vùng hiển thị tin nhắn */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              paddingRight: "5px",
              paddingBottom: "10px",
            }}
          >
            {content.map((item) => (
              <p
                key={item.id}
                style={{
                  background: item.sender === "user" ? "#ccc" : "#25BA4D",
                  color:
                    item.sender === "bot-loading"
                      ? "white"
                      : item.sender === "bot"
                      ? "white"
                      : "black",
                  padding: "3%",
                  fontSize: "14px",
                  borderRadius: "10px",
                  width: "fit-content",
                  maxWidth: "80%",
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  alignSelf:
                    item.sender === "user" ? "flex-end" : "flex-start",
                  fontStyle: item.sender === "bot-loading" ? "italic" : "normal",
                }}
              >
                {item.sender === "bot-loading" ? (
                  <>
                    Đang suy nghĩ
                    <span className="dot-1">.</span>
                    <span className="dot-2">.</span>
                    <span className="dot-3">.</span>
                  </>
                ) : (
                  item.content
                )}
              </p>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Vùng nhập tin nhắn */}
          <div style={{ width: "100%", position: "relative", marginTop: 10 }}>
            <input
              style={{
                width: "100%",
                padding: "2% 5%",
                borderRadius: 30,
              }}
              type="text"
              placeholder="Nhập vào đây"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              style={{
                position: "absolute",
                right: "2%",
                top: "10%",
                border: "none",
                background: "#25BA4D",
                color: "white",
                borderRadius: "20px",
                padding: "5px 10px",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      <div style={{ width: "70%", padding: "3%" }}>
        <p style={{ color: "black", fontSize: 36 }}>
          <RiRobot2Line />
        </p>
        <span>Trang phục sẽ hiển thị ở đây</span>
      </div>
    </div>
  );
}
