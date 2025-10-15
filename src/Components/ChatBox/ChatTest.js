import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ChatTest.css';

const ChatTest = () => {
  const [socket, setSocket] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [content, setContent] = useState('');
  const [type, setType] = useState('USER');
  const [id, setId] = useState('1');
  const [otherId, setOtherId] = useState('2'); // Default to 2
  const [token, setToken] = useState('');
  const messagesEndRef = useRef(null);

  // Get roomId
  const getRoomId = (senderType, senderId, receiverType, receiverId) => {
    if (senderType === 'USER' && receiverType === 'SHOP') {
      return `u${senderId}-s${receiverId}`;
    } else if (senderType === 'SHOP' && receiverType === 'USER') {
      return `u${receiverId}-s${senderId}`;
    }
    return '';
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize socket and load params
  useEffect(() => {
    // Get params from URL
    const typeFromUrl = 'USER';
    const idFromUrl = '1';
    const tokenFromUrl = 'eyJhbGciOiJIUzUxMiJ9.eyJtYWlsIjoidGhhbmhudC50ZWNoQGdtYWlsLmNvbSIsInBob25lIjoiMDEyMzQ1Njc4OSIsInJvbGVzIjpbIlJPTEVfQURNSU4iLCJST0xFX1VTRVIiXSwidXNlcklkIjoxLCJ1c2VybmFtZSI6InRoYW5obnQudGVjaEBnbWFpbC5jb20iLCJpYXQiOjE3NDc0NTQ4MDMsImV4cCI6MTc0ODY2NDMwM30.GJDJHchw-JqZvmMWiv2Zo0k_GoGz25wNxz9YfveCu_aV0Ygm8DpK69LWnBkubYIrfUGocnxZd_QjO6lj-mNeVA';
    const otherIdFromUrl = '2'; // Default to 2

    // Validate params
    if (!typeFromUrl || !idFromUrl || !tokenFromUrl) {
      toast.error('Thiếu type, id hoặc token trong URL');
      return;
    }

    setType(typeFromUrl);
    setId(idFromUrl);
    setToken(tokenFromUrl);
    setOtherId(otherIdFromUrl);

    // Connect to SocketIO
    const newSocket = io('http://localhost:3000/?type=USER&id=2&token=Bearer%20eyJhbGciOiJIUzUxMiJ9.eyJtYWlsIjoidGhhbmhudC50ZWNoQGdtYWlsLmNvbSIsInBob25lIjoiMDEyMzQ1Njc4OSIsInJvbGVzIjpbIlJPTEVfQURNSU4iLCJST0xFX1VTRVIiXSwidXNlcklkIjoxLCJ1c2VybmFtZSI6InRoYW5obnQudGVjaEBnbWFpbC5jb20iLCJpYXQiOjE3NDc0NTQ4MDMsImV4cCI6MTc0ODY2NDMwM30.GJDJHchw-JqZvmMWiv2Zo0k_GoGz25wNxz9YfveCu_aV0Ygm8DpK69LWnBkubYIrfUGocnxZd_QjO6lj-mNeVA'
    );

    newSocket.on('connect', () => {
      console.log(`${typeFromUrl} ${idFromUrl} connected to Socket.IO`);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      toast.error('Không kết nối được server. Kiểm tra token hoặc mạng.');
    });

    // Receive messages
    newSocket.on('receive_message', (socketDTO) => {
      const msg = socketDTO.data;
      console.log('Received message:', msg);

      const roomId = getRoomId(msg.senderType, msg.senderId, msg.receiverType, msg.receiverId);
      const expectedRoomId = getRoomId(typeFromUrl, idFromUrl, typeFromUrl === 'USER' ? 'SHOP' : 'USER', otherIdFromUrl);

      if (roomId === expectedRoomId) {
        setChatList((prev) => [...prev, msg]);
      } else {
        toast.info(
          `${msg.senderName || `${msg.senderType} ${msg.senderId}`}: ${
            msg.content.length > 20 ? msg.content.substring(0, 20) + '...' : msg.content
          }`,
          {
            position: 'top-right',
            autoClose: 3000,
            theme: 'light',
          }
        );
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.off('receive_message');
      newSocket.disconnect();
    };
  }, []); // Run once on mount

  // Auto-scroll when chatList updates
  useEffect(() => {
    scrollToBottom();
  }, [chatList]);

  // Send message
  const handleSend = () => {
    if (!content.trim() || !socket || !type || !id || !otherId) {
      toast.error('Vui lòng điền đầy đủ thông tin', { position: 'top-right' });
      return;
    }

    const message = {
      senderType: type,
      senderId: parseInt(id),
      receiverType: type === 'USER' ? 'SHOP' : 'USER',
      receiverId: parseInt(otherId),
      content,
      type: 'private',
    };

    socket.emit('send_message', message, (response) => {
      console.log('Server response:', response);
      if (response && typeof response === 'string' && response.includes('Invalid')) {
        toast.error(response || 'Không gửi được tin nhắn', { position: 'top-right' });
      }
    });

    setContent('');
  };

  return (
    <div className="chat-container">
      <ToastContainer />
      <div className="chat-header">
        <img
          src="https://via.placeholder.com/40"
          alt="avatar"
          className="header-avatar"
        />
        <div className="header-name">{type === 'USER' ? `Shop ${otherId}` : `User ${otherId}`}</div>
      </div>
      <div className="chat-messages">
        {chatList.length === 0 ? (
          <p className="no-messages">Chưa có tin nhắn</p>
        ) : (
          chatList.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.senderType === type && msg.senderId.toString() === id
                  ? 'message-right'
                  : 'message-left'
              }`}
            >
              {msg.senderType !== type || msg.senderId.toString() !== id ? (
                <img
                  src={msg.senderAvatar || 'https://via.placeholder.com/30'}
                  alt="avatar"
                  className="message-avatar"
                />
              ) : null}
              <div className="message-content">
                <div className="message-sender">{msg.senderName || `${msg.senderType} ${msg.senderId}`}</div>
                <div>{msg.content}</div>
                <div className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {msg.senderType === type && msg.senderId.toString() === id ? (
                <img
                  src={msg.senderAvatar || 'https://via.placeholder.com/30'}
                  alt="avatar"
                  className="message-avatar"
                />
              ) : null}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="message-input"
        />
        <button onClick={handleSend} className="send-button">
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatTest;