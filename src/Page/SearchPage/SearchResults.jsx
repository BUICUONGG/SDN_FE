import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchResults.css";
import { appService } from "../../service/appService";
import i1 from "../../img/sr1.jpg";
import i2 from "../../img/sr2.jpg";
import i3 from "../../img/sr3.jpg";
import i4 from "../../img/sr4.jpg";
import i5 from "../../img/sr5.jpg";

export default function SearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword");

  const [newProducts, setNewProducts] = useState([]);
  const [bestDeals, setBestDeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (keyword) {
      fetchSearchResults(keyword);
    }
  }, [keyword]);

  const fetchSearchResults = async (kw) => {
    try {
      const res = await appService.searchProducts({
        search: kw,
        currentPage: 1,
        pageSize: 40,
      });
      const data = res.data.metadata.metadata || [];

      console.log(data)

      const mapped = data.map((p) => ({
        id: p.id,
        name: p.name,
        imageUrl: p.imageUrl || p.image || '',
        price: p.resalePrice || p.discountedPrice || p.price || 0,
      }));

      setNewProducts(mapped.slice(0, 10));
      setBestDeals(mapped.slice(10, 20));
    } catch (err) {
      console.error("❌ Lỗi fetch:", err);
    }
  };


  const categoryTags2 = [
    {
      name:  "Trang phục thường ngày",
      image: i1
    },
    {
      name:  "Dạ tiệc & Trang trọng",
      image: i2
    },
    {
      name:  "Hoa xuân rực rỡ",
      image: i3
    },
    {
      name:  "Trang phục du lịch",
      image: i4
    },
    {
      name:  "Dự tiệc cưới",
      image: i5
    }
  ];

  const filters = [
    "Kích thước", "Danh mục", "Bí quyết", "Phong cách", "Đầm dài",
    "Thương hiệu", "Mức giá", "Tình trạng", "Màu sắc", "Kiểu cổ áo",
    "Chất liệu", "Hoạ tiết", "Cỡ", "Cách sử dụng"
  ];

  const renderProductCard = (product) => (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
     className="product-card" key={product.id}>
      <img
        src={product.imageUrl}
        alt={product.name}
        style={{
          width: "100%",
          height: "250px",
          objectFit: "cover",
          objectPosition: "top",
          borderRadius: "6px"
        }}
      />
      <p style={{color: 'black'}} className="product-name">{product.name}</p>
      <p className="product-price">{product.price.toLocaleString()}₫</p>
      <button className="add-btn">🛒</button>
    </div>
  );

  const renderProductSection = (title, products) => (
    <div className="product-section">
      <h3>{title}</h3>
      <div className="product-grid">
        {products.map(renderProductCard)}
      </div>
    </div>
  );

  return (
    <div style={{
      padding: '3% 10%'
    }} className="search-page">
      <h2 className="page-title">Xu hướng</h2>

      <div className="category-tags">
        {categoryTags2.map((tag) => (
          <div style={{
            width: '20%'
          }} className="tag-card" key={tag.name}>
            <img src={tag.image} alt={tag.name} />
            <span>{tag.name}</span>
          </div>
        ))}
      </div>

      <div className="search-layout">
        <div className="sidebar-filter">
          <h3>Bộ lọc sản phẩm</h3>
          {filters.map((f) => (
            <div key={f} className="filter-item">
              <span>{f}</span> <span className="plus">+</span>
            </div>
          ))}
        </div>

        <div className="product-sections">
          {renderProductSection("Mới về", newProducts)}
          {renderProductSection("Giá tốt", bestDeals)}
        </div>
      </div>
    </div>
  );
}
