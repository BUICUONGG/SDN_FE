// src/Page/AuctionDetail.js
import React, { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Button,
  Form,
  message,
  Spin,
  Table,
  Tag,
  Empty,
} from "antd";
import { appService } from "../../service/appService";

export default function AuctionDetail() {
  const [auction, setAuction] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [walletLoading, setWalletLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState("");

  // Lịch sử đấu giá
  const [bidHistory, setBidHistory] = useState([]);
  const [bidHistoryLoading, setBidHistoryLoading] = useState(true);

  // Modal states
  const [depositVisible, setDepositVisible] = useState(false);
  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [depositForm] = Form.useForm();
  const [withdrawForm] = Form.useForm();

  // Transaction history
  const [transactions, setTransactions] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const auctionId = window.location.pathname.split("/").pop();

  // Load auction + wallet + bid history
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [auctionRes, walletRes, bidHistoryRes] = await Promise.all([
          appService.getAutionDetail(auctionId),
          appService.getWalletBalance(),
          appService.getBidHistory(auctionId), // LẤY LỊCH SỬ ĐẤU GIÁ
        ]);
        setAuction(auctionRes.data.auction);
        setWalletBalance(walletRes.data.balance || 0);
        setBidHistory(bidHistoryRes.data.bids || []);
      } catch (err) {
        setError("Không tải được dữ liệu.");
      } finally {
        setLoading(false);
        setWalletLoading(false);
        setBidHistoryLoading(false);
      }
    };

    if (auctionId) fetchData();
  }, [auctionId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // === KIỂM TRA ĐIỀU KIỆN ĐẶT GIÁ ===
  const isValidBid = (amountStr, minBid, balance) => {
    if (!amountStr) return true;
    const amount = parseInt(amountStr);
    if (isNaN(amount)) return true;
    return amount < minBid || amount > balance;
  };

  // === XỬ LÝ ĐẶT GIÁ ===
  const handleBid = async () => {
    setBidError("");
    setBidSuccess("");
    setBidLoading(true);

    const minBid = (auction.current_bid || auction.start_price) + 100000;
    const amount = parseInt(bidAmount);

    if (!bidAmount || isNaN(amount) || amount < minBid) {
      setBidError(`Số tiền phải lớn hơn ${formatPrice(minBid)}`);
      setBidLoading(false);
      return;
    }

    if (amount > walletBalance) {
      setBidError("Số dư không đủ để đặt giá");
      setBidLoading(false);
      return;
    }

    try {
      await appService.bidAuction(auctionId, amount);
      setBidSuccess("Đặt giá thành công! Đang cập nhật...");

      const [updatedAuction, updatedWallet, updatedHistory] = await Promise.all([
        appService.getAutionDetail(auctionId),
        appService.getWalletBalance(),
        appService.getBidHistory(auctionId),
      ]);
      setAuction(updatedAuction.data.auction);
      setWalletBalance(updatedWallet.data.balance || 0);
      setBidHistory(updatedHistory.data.bids || []);
      setBidAmount("");
    } catch (err) {
      const msg = err.response?.data?.message || "Đặt giá thất bại. Vui lòng thử lại!";
      setBidError(msg);
    } finally {
      setBidLoading(false);
    }
  };

  // === NẠP TIỀN ===
  const handleDeposit = async (values) => {
    const value = parseInt(values.amount);
    if (!value || value < 100000) {
      message.error("Số tiền tối thiểu là 100.000 VND");
      return;
    }

    try {
      await appService.depositToWallet(value);
      const res = await appService.getWalletBalance();
      setWalletBalance(res.data.balance);
      message.success("Nạp tiền thành công!");
      setDepositVisible(false);
      depositForm.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || "Nạp tiền thất bại");
    }
  };

  // === RÚT TIỀN ===
  const handleWithdraw = async (values) => {
    const value = parseInt(values.amount);
    if (!value || value < 100000 || value > walletBalance) {
      message.error("Số tiền không hợp lệ hoặc vượt quá số dư");
      return;
    }

    try {
      await appService.withdrawFromWallet(value);
      const res = await appService.getWalletBalance();
      setWalletBalance(res.data.balance);
      message.success("Rút tiền thành công!");
      setWithdrawVisible(false);
      withdrawForm.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || "Rút tiền thất bại");
    }
  };

  // === LỊCH SỬ GIAO DỊCH VÍ ===
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await appService.getTransactionHistory();
      setTransactions(res.data.transactions || []);
    } catch (err) {
      message.error("Không tải được lịch sử giao dịch");
    } finally {
      setHistoryLoading(false);
    }
  };

  const openHistory = () => {
    setHistoryVisible(true);
    fetchHistory();
  };

  const columns = [
    { title: "Thời gian", dataIndex: "createdAt", key: "createdAt", render: (date) => formatDate(date) },
    {
      title: "Loại", dataIndex: "type", key: "type",
      render: (type) => (
        <Tag color={type === "deposit" ? "green" : type === "withdraw" ? "orange" : "blue"}>
          {type === "deposit" ? "Nạp tiền" : type === "withdraw" ? "Rút tiền" : "Đặt giá"}
        </Tag>
      ),
    },
    {
      title: "Số tiền", dataIndex: "amount", key: "amount",
      render: (amount, record) => (
        <span style={{ color: record.type === "deposit" ? "#16a34a" : "#dc2626" }}>
          {record.type === "deposit" ? "+" : "-"} {formatPrice(amount)}
        </span>
      ),
    },
    {
      title: "Trạng thái", dataIndex: "status", key: "status",
      render: (status) => (
        <Tag color={status === "completed" ? "success" : status === "pending" ? "processing" : "error"}>
          {status === "completed" ? "Hoàn tất" : status === "pending" ? "Đang xử lý" : "Thất bại"}
        </Tag>
      ),
    },
  ];

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!auction) return <div className="empty">Không tìm thấy đấu giá.</div>;

  const product = auction.product || {};
  const vehicle = product.vehicle?.[0] || {};
  const isEnded = auction.status === "ended";
  const minBid = (auction.current_bid || auction.start_price) + 100000;

  return (
    <>
      <style jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; }

        .page-wrapper { max-width: 1200px; margin: 20px auto; padding: 0 20px; }

        .wallet-bar {
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white; padding: 20px 32px; border-radius: 20px;
          margin-bottom: 32px; display: flex; justify-content: space-between;
          align-items: center; box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .wallet-info h3 { font-size: 18px; margin-bottom: 8px; opacity: 0.9; }
        .wallet-balance { font-size: 28px; font-weight: bold; }
        .wallet-actions { display: flex; gap: 12px; flex-wrap: wrap; }

        .ant-btn { border-radius: 12px; font-weight: 600; }
        .ant-btn-primary { background: #3b82f6; border-color: #3b82f6; }

        .detail-container {
          display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
          background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          padding: 32px;
        }
        @media (max-width: 768px) {
          .detail-container { grid-template-columns: 1fr; padding: 20px; }
          .wallet-bar { flex-direction: column; text-align: center; gap: 16px; }
          .wallet-actions { justify-content: center; }
        }

        .image-gallery img { width: 100%; height: 400px; object-fit: cover; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
        .thumbnails { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
        .thumbnails img { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid #e2e8f0; transition: all 0.2s; }
        .thumbnails img:hover { border-color: #3b82f6; transform: scale(1.1); }

        .info-section { padding: 20px 0; }
        .product-title { font-size: 28px; font-weight: bold; color: #1e293b; margin-bottom: 12px; }
        .status-badge { display: inline-block; padding: 6px 16px; border-radius: 999px; font-weight: bold; font-size: 14px; margin-bottom: 16px; }
        .status-ended { background: #fee2e2; color: #991b1b; }
        .status-live { background: #dcfce7; color: #166534; }

        .price-highlight { font-size: 32px; font-weight: bold; color: #3b82f6; margin: 20px 0; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; font-size: 15px; }
        .info-item { background: #f8fafc; padding: 12px; border-radius: 12px; border-left: 4px solid #3b82f6; }
        .label { font-weight: 600; color: #475569; display: block; margin-bottom: 4px; }
        .value { color: #1e293b; font-weight: 500; }

        .bid-section {
          margin-top: 32px; padding: 24px; border-radius: 16px; text-align: center;
          background: ${isEnded ? "#fee2e2" : "linear-gradient(135deg, #3b82f6, #6366f1)"};
          color: ${isEnded ? "#991b1b" : "white"};
        }
        .bid-section h3 { font-size: 24px; margin-bottom: 12px; }
        .bid-input { padding: 14px; width: 100%; max-width: 300px; margin: 16px auto; border-radius: 12px; border: 2px solid ${isEnded ? "#fca5a5" : "#93c5fd"}; font-size: 18px; text-align: center; background: white; }
        .bid-input:focus { outline: none; border-color: #3b82f6; }
        .bid-button { background: ${isEnded ? "#fca5a5" : "white"}; color: ${isEnded ? "white" : "#3b82f6"}; font-weight: bold; padding: 14px 32px; border: none; border-radius: 12px; font-size: 18px; cursor: ${isEnded ? "not-allowed" : "pointer"}; margin-top: 8px; }
        .bid-button:hover:not(:disabled) { background: ${isEnded ? "#f87171" : "#f0f4ff"}; transform: scale(1.05); }
        .bid-message { margin-top: 12px; font-size: 14px; font-weight: bold; }
        .bid-success { color: #166534; }
        .bid-error { color: #ef4444; }
        .min-bid-note { font-size: 13px; color: #64748b; margin-top: 8px; }

        /* LỊCH SỬ ĐẤU GIÁ */
        .bid-history-title { font-size: 24px; font-weight: bold; color: #1e293b; margin: 48px 0 24px; text-align: center; }
        .bid-history-list { display: flex; flex-direction: column; gap: 16px; max-width: 800px; margin: 0 auto; }
        .bid-item { display: flex; align-items: center; background: white; padding: 16px 20px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: all 0.2s; position: relative; }
        .bid-item:hover { box-shadow: 0 8px 20px rgba(0,0,0,0.15); transform: translateY(-2px); }
        .bid-rank { font-size: 18px; font-weight: bold; color: #64748b; width: 40px; text-align: center; }
        .bid-user { flex: 1; display: flex; align-items: center; gap: 12px; }
        .user-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0; }
        .user-name { font-weight: 600; color: #1e293b; }
        .bid-time { font-size: 13px; color: #94a3b8; }
        .bid-amount { font-size: 20px; font-weight: bold; color: #3b82f6; text-align: right; min-width: 140px; }
        @media (max-width: 640px) {
          .bid-item { flex-direction: column; text-align: center; gap: 12px; }
          .bid-amount { text-align: center; min-width: auto; }
          .bid-rank { position: absolute; top: 12px; right: 12px; font-size: 14px; }
        }

        .loading, .error, .empty { text-align: center; padding: 100px; font-size: 20px; }
        .loading { color: #64748b; }
        .error { color: #ef4444; }
        .empty { color: #94a3b8; }
      `}</style>

      <div className="page-wrapper">
        {/* Ví đấu giá */}
        <div className="wallet-bar">
          <div className="wallet-info">
            <h3>Ví đấu giá của bạn</h3>
            <div className="wallet-balance">
              {walletLoading ? "Đang tải..." : formatPrice(walletBalance)}
            </div>
          </div>
          <div className="wallet-actions">
            <Button type="primary" size="large" onClick={() => setDepositVisible(true)}>Nạp tiền</Button>
            <Button danger size="large" onClick={() => setWithdrawVisible(true)}>Rút tiền</Button>
            <Button size="large" onClick={openHistory}>Lịch sử giao dịch</Button>
          </div>
        </div>

        {/* Chi tiết đấu giá */}
        <div className="detail-container">
          <div className="image-gallery">
            <img src={product.image_url?.[0] || "https://via.placeholder.com/600x400"} alt={vehicle.name} />
            <div className="thumbnails">
              {product.image_url?.map((url, i) => <img key={i} src={url} alt={`Thumb ${i}`} />)}
            </div>
          </div>

          <div className="info-section">
            <h1 className="product-title">{vehicle.name || "Sản phẩm đấu giá"}</h1>
            <span className={`status-badge status-${auction.status}`}>
              {isEnded ? "Đã kết thúc" : "Đang diễn ra"}
            </span>

            <div className="price-highlight">
              {formatPrice(auction.current_bid || auction.start_price)}
            </div>

            <div className="info-grid">
              <div className="info-item"><span className="label">Giá khởi điểm</span><div className="value">{formatPrice(auction.start_price)}</div></div>
              <div className="info-item"><span className="label">Bid hiện tại</span><div className="value">{auction.current_bid ? formatPrice(auction.current_bid) : "Chưa có"}</div></div>
              <div className="info-item"><span className="label">Bắt đầu</span><div className="value">{formatDate(auction.start_date)}</div></div>
              <div className="info-item"><span className="label">Kết thúc</span><div className="value">{formatDate(auction.end_date)}</div></div>
              <div className="info-item"><span className="label">Năm sản xuất</span><div className="value">{vehicle.year || "—"}</div></div>
              <div className="info-item"><span className="label">Quãng đường</span><div className="value">{vehicle.mileage?.toLocaleString() || "—"} km</div></div>
              <div className="info-item"><span className="label">Màu sắc</span><div className="value">{vehicle.color || "—"}</div></div>
              <div className="info-item"><span className="label">Đặt cọc</span><div className="value">{formatPrice(auction.deposit_required)}</div></div>
            </div>

            <div className="bid-section">
              <h3>{isEnded ? "Đấu giá đã kết thúc" : "Đặt Giá Của Bạn"}</h3>
              {!isEnded && (
                <>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Nhập số tiền (VND)"
                    className="bid-input"
                    min={minBid}
                    step="100000"
                    disabled={bidLoading}
                  />
                  <div className="min-bid-note">
                    Tối thiểu: {formatPrice(minBid)} | 
                    Số dư: <strong style={{ color: bidAmount && parseInt(bidAmount) > walletBalance ? '#ef4444' : '#16a34a' }}>
                      {formatPrice(walletBalance)}
                    </strong>
                  </div>
                </>
              )}
              <button
                onClick={handleBid}
                disabled={isEnded || bidLoading || isValidBid(bidAmount, minBid, walletBalance)}
                className="bid-button"
              >
                {bidLoading ? "Đang xử lý..." : isEnded ? "Đã kết thúc" : !bidAmount ? "Nhập số tiền" : parseInt(bidAmount) < minBid ? "Dưới mức tối thiểu" : parseInt(bidAmount) > walletBalance ? "Số dư không đủ" : "Xác Nhận Đặt Giá"}
              </button>
              {bidSuccess && <div className="bid-message bid-success">{bidSuccess}</div>}
              {bidError && <div className="bid-message bid-error">{bidError}</div>}
            </div>
          </div>
        </div>

        {/* LỊCH SỬ ĐẤU GIÁ */}
        <h2 className="bid-history-title">Lịch Sử Đấu Giá</h2>
        {bidHistoryLoading ? (
          <div style={{ textAlign: "center", padding: 40 }}><Spin size="large" /></div>
        ) : bidHistory.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, background: "#f8fafc", borderRadius: 16 }}>
            <Empty description="Chưa có lượt đấu giá nào" />
          </div>
        ) : (
          <div className="bid-history-list">
            {bidHistory.map((bid, index) => {
              const user = bid.user || {};
              const profile = user.user_profile || {};
              return (
                <div key={bid._id} className="bid-item">
                  <div className="bid-rank">#{bidHistory.length - index}</div>
                  <div className="bid-user">
                    <img
                      src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || user.username)}&background=3b82f6&color=fff`}
                      alt={profile.name}
                      className="user-avatar"
                    />
                    <div>
                      <div className="user-name">{profile.name || user.username}</div>
                      <div className="bid-time">{formatDate(bid.timestamp)}</div>
                    </div>
                  </div>
                  <div className="bid-amount">{formatPrice(bid.bid_amount)}</div>
                  {bid.is_winner && <Tag color="gold" style={{ marginLeft: 8 }}>Người thắng</Tag>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Nạp tiền */}
      <Modal title="Nạp tiền vào ví" open={depositVisible} onCancel={() => { setDepositVisible(false); depositForm.resetFields(); }} footer={null} width={420}>
        <Form form={depositForm} onFinish={handleDeposit} layout="vertical">
          <Form.Item name="amount" rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}>
            <Input type="number" placeholder="Nhập số tiền (VND)" size="large" min={100000} step={10000} />
          </Form.Item>
          <Form.Item><Button type="primary" htmlType="submit" block size="large">Nạp ngay</Button></Form.Item>
        </Form>
      </Modal>

      {/* Modal Rút tiền */}
      <Modal title="Rút tiền từ ví" open={withdrawVisible} onCancel={() => { setWithdrawVisible(false); withdrawForm.resetFields(); }} footer={null} width={420}>
        <div style={{ marginBottom: 16, fontSize: 14, color: "#64748b" }}>
          Số dư khả dụng: <strong>{formatPrice(walletBalance)}</strong>
        </div>
        <Form form={withdrawForm} onFinish={handleWithdraw} layout="vertical">
          <Form.Item name="amount" rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}>
            <Input type="number" placeholder="Nhập số tiền (VND)" size="large" min={100000} max={walletBalance} step={10000} />
          </Form.Item>
          <Form.Item><Button danger htmlType="submit" block size="large">Rút tiền</Button></Form.Item>
        </Form>
      </Modal>

      {/* Modal Lịch sử giao dịch ví */}
      <Modal title="Lịch sử giao dịch" open={historyVisible} onCancel={() => setHistoryVisible(false)} footer={null} width={800}>
        {historyLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}><Spin size="large" /></div>
        ) : transactions.length === 0 ? (
          <Empty description="Chưa có giao dịch nào" />
        ) : (
          <Table dataSource={transactions} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} scroll={{ x: 500 }} />
        )}
      </Modal>
    </>
  );
}