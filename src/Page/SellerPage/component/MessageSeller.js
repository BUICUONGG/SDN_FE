import React, { useState } from "react";
import { Input, Avatar, List, Typography, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

const { Text } = Typography;

const conversations = [
  {
    id: 1,
    name: "Dodana",
    avatar: "https://via.placeholder.com/40",
    date: "02/04",
    messages: [
      {
        sender: "customer",
        text: "Shop ơi, sản phẩm này còn hàng không ạ?",
        date: "02/04/2025",
      },
      {
        sender: "shop",
        text: "Dạ còn hàng ạ, bạn cần mình hỗ trợ đặt đơn không?",
        date: "02/04/2025",
      },
    ],
  },
  {
    id: 2,
    name: "Dodana",
    avatar: "https://via.placeholder.com/40",
    date: "07/03/2023",
    messages: [],
  },
  {
    id: 3,
    name: "Dodana",
    avatar: "https://via.placeholder.com/40",
    date: "12/04",
    messages: [],
  },
  {
    id: 4,
    name: "Dodana",
    avatar: "https://via.placeholder.com/40",
    date: "22/04",
    messages: [],
  },
];

export default function MessageSeller() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const updatedMessages = [
      ...selectedConversation.messages,
      {
        sender: "shop",
        text: inputValue,
        date: new Date().toLocaleDateString("vi-VN"),
      },
    ];

    const updatedConversation = {
      ...selectedConversation,
      messages: updatedMessages,
    };

    setSelectedConversation(updatedConversation);
    setInputValue("");
  };

  return (
    <div style={{
      padding: '2%'
    }}>
      <div style={{ display: "flex", height: "80vh", background: "#f9f9f9", borderRadius: 8, overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 250, background: "#fff", borderRight: "1px solid #eee", padding: 12 }}>
        <Input.Search placeholder="Search" style={{ marginBottom: 12 }} />
        <List
          itemLayout="horizontal"
          dataSource={conversations}
          renderItem={(item) => (
            <List.Item onClick={() => setSelectedConversation(item)} style={{ cursor: "pointer", padding: 8 }}>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<Text strong>{item.name}</Text>}
                description={item.date}
              />
            </List.Item>
          )}
        />
      </div>

      {/* Chat Window */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff" }}>
        {/* Header */}
        <div style={{ padding: 16, borderBottom: "1px solid #eee", fontWeight: "bold", fontSize: 16 }}>
          <Avatar src={selectedConversation.avatar} style={{ marginRight: 8 }} />
          {selectedConversation.name}
        </div>

        {/* Message List */}
        <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
          {selectedConversation.messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: 16, textAlign: msg.sender === "shop" ? "right" : "left" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: 10,
                  borderRadius: 10,
                  background: msg.sender === "shop" ? "#e6f7ff" : "#f0f0f0",
                  maxWidth: "70%",
                }}
              >
                {msg.text}
              </div>
              <div style={{ fontSize: 10, color: "#999", marginTop: 4 }}>
                {msg.date} {msg.sender === "shop" ? "Đã gửi" : ""}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: 16, borderTop: "1px solid #eee", display: "flex", alignItems: "center" }}>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nhập nội dung tin nhắn"
            style={{ flex: 1, marginRight: 8 }}
            onPressEnter={handleSend}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<SendOutlined />}
            onClick={handleSend}
          />
        </div>
      </div>
    </div>
    </div>
  );
}
