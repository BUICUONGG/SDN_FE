import React, { useEffect, useState } from "react";
import { appService } from "../../service/appService";

const ITEMS_PER_PAGE = 8;

export default function AuctionPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await appService.getAutions();
        setAuctions(res.data.auctions || []);
      } catch (err) {
        setError("Không thể tải danh sách đấu giá. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleBidClick = (auctionId) => {
    window.location.href = `/auction-channel/detail/${auctionId}`;
  };

  // Phân trang logic
  const totalPages = Math.ceil(auctions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAuctions = auctions.slice(startIndex, endIndex);

  // Hàm render số trang (hiển thị 5 số, với ... nếu nhiều)
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => setCurrentPage(1)} className="page-btn">
          1
        </button>
      );
      if (startPage > 2)
        pages.push(
          <span key="start-ellipsis" className="ellipsis">
            ...
          </span>
        );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`page-btn ${i === currentPage ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1)
        pages.push(
          <span key="end-ellipsis" className="ellipsis">
            ...
          </span>
        );
      pages.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className="page-btn"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Đang tải đấu giá...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: Arial, sans-serif;
        }

        .page-container {
          min-height: 100vh;
          background: linear-gradient(to bottom, #f0f4ff, #ffffff);
          padding: 48px 16px;
        }

        .max-width {
          max-width: 1400px;
          margin: 0 auto;
        }

        h1 {
          font-size: 36px;
          font-weight: bold;
          text-align: center;
          color: #333;
          margin-bottom: 40px;
        }

        .empty-text {
          text-align: center;
          color: #666;
          font-size: 18px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 32px;
          margin-bottom: 48px;
        }

        @media (min-width: 640px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1280px) {
          .grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .card:hover {
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
          transform: translateY(-8px);
        }

        .image-wrapper {
          position: relative;
        }

        .image-wrapper img {
          width: 100%;
          height: 192px;
          object-fit: cover;
        }

        .live-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #ef4444;
          color: white;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: bold;
        }

        .card-body {
          padding: 20px;
        }

        .product-name {
          font-size: 20px;
          font-weight: bold;
          color: #333;
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .description {
          color: #666;
          font-size: 14px;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .label {
          color: #888;
        }
        .start-price {
          color: #10b981;
          font-weight: bold;
        }
        .current-bid {
          color: #3b82f6;
          font-weight: bold;
          font-size: 18px;
        }
        .deposit {
          color: #f97316;
          font-weight: bold;
        }

        .bid-button {
          width: 100%;
          background: linear-gradient(to right, #3b82f6, #6366f1);
          color: white;
          font-weight: bold;
          padding: 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
          margin-top: 16px;
        }

        /* Pagination styles */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .nav-btn {
          background: #e5e7eb;
          color: #374151;
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
        }

        .nav-btn:hover:not(:disabled) {
          background: #d1d5db;
        }

        .nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-btn {
          background: #f3f4f6;
          color: #374151;
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
        }

        .page-btn:hover {
          background: #e5e7eb;
        }

        .page-btn.active {
          background: #3b82f6;
          color: white;
        }

        .ellipsis {
          color: #888;
          font-weight: bold;
        }

        .loading-container,
        .error-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
        }

        .loading-container p {
          font-size: 20px;
          color: #555;
          font-weight: bold;
        }
        .error-container p {
          font-size: 18px;
          color: #ef4444;
        }
      `}</style>

      <div className="page-container">
        <div className="max-width">
          <h1>Danh Sách Đấu Giá</h1>

          {auctions.length === 0 ? (
            <p className="empty-text">Hiện chưa có đấu giá nào.</p>
          ) : (
            <>
              <div className="grid">
                {currentAuctions.map((auction) => {
                  const product = auction.product || {};
                  const imgUrl =
                    product.image_url?.[0] ||
                    "https://via.placeholder.com/300x200?text=No+Image";

                  return (
                    <div key={auction._id} className="card">
                      <div className="image-wrapper">
                        <img src={imgUrl} alt={product.name || "Sản phẩm"} />
                        <div className="live-badge">Live</div>
                      </div>

                      <div className="card-body">
                        <div className="product-name">
                          {product.slug || "Không tên"}
                        </div>
                        <p className="description">
                          {product.description || "Không có mô tả."}
                        </p>

                        <div className="info-row">
                          <span className="label">Giá khởi điểm:</span>
                          <span className="start-price">
                            {formatPrice(auction.start_price)}
                          </span>
                        </div>

                        <div className="info-row">
                          <span className="label">Bid hiện tại:</span>
                          <span className="current-bid">
                            {auction.current_bid
                              ? formatPrice(auction.current_bid)
                              : "Chưa có"}
                          </span>
                        </div>

                        <div className="info-row">
                          <span className="label">Đặt cọc:</span>
                          <span className="deposit">
                            {formatPrice(auction.deposit_required)}
                          </span>
                        </div>

                        <button
                          onClick={() => handleBidClick(auction._id)}
                          className="bid-button"
                        >
                          Đặt Giá Ngay
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="nav-btn"
                  >
                    Previous
                  </button>

                  {renderPageNumbers()}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="nav-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
