import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchResults.css";
import { appService } from "../../service/appService";

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
      const res = await appService.getAllProduct();

      const data = res.data?.products || res.data || [];

      if (!Array.isArray(data)) {
        setNewProducts([]);
        setBestDeals([]);
        return;
      }

      const allMapped = data.map((p) => {
        const batteryName = p.vehicle?.[0]?.battery?.name || p.battery?.name || p.name || '';
        const productId = p._id || p.id;
        const brandName = p.brand?.name || '';
        const categoryName = p.category?.name || '';

        return {
          id: productId,
          name: batteryName,
          image_url: p.image_url?.[0] || p.image || 'https://via.placeholder.com/300x200?text=No+Image',
          price: p.price || 0,
          searchText: `${batteryName} ${p.slug || ''} ${brandName} ${categoryName}`.toLowerCase(),
        };
      });

      const keyword = kw.toLowerCase().trim();
      const filtered = keyword
        ? allMapped.filter(p => p.searchText.includes(keyword))
        : allMapped;

      setNewProducts(filtered.slice(0, 10));
      setBestDeals(filtered.slice(10, 20));
    } catch (err) {
      setNewProducts([]);
      setBestDeals([]);
    }
  };


  const renderProductCard = (product) => (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
     className="product-card" key={product.id}>
      <img
        src={product.image_url}
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
      {keyword && (
        <h2 className="page-title">Kết quả tìm kiếm: "{keyword}"</h2>
      )}

      <div style={{ marginTop: '30px' }}>
        {newProducts.length === 0 && bestDeals.length === 0 && keyword ? (
          <div style={{
            textAlign: 'center',
            padding: '50px 20px',
            fontSize: '18px',
            color: '#666'
          }}>
            Không tìm thấy pin nào phù hợp với từ khóa "{keyword}"
          </div>
        ) : (
          <>
            {newProducts.length > 0 && renderProductSection("Kết quả tìm kiếm", newProducts)}
            {bestDeals.length > 0 && renderProductSection("Các sản phẩm khác", bestDeals)}
          </>
        )}
      </div>
    </div>
  );
}
