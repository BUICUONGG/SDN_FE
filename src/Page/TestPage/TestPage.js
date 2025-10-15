import React, { useState } from 'react';
import { calculateShippingFee } from '../../service/ghnService';

export default function TestPage() {
  const [fee, setFee] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    try {
      const shippingFee = await calculateShippingFee({
        to_district_id: 1482,
        to_ward_code: '21012',
        weight: 500,
        length: 20,
        width: 15,
        height: 10,
      });
      setFee(shippingFee);
    } catch (error) {
      setFee('Lỗi');
    }
    setLoading(false);
  };

  return (
    <div className="ghn-container">
      <h2 className="ghn-title">GHN Shipping Fee Test</h2>
      <button onClick={handleTest} className="ghn-button">
        Tính phí giao hàng
      </button>

      {loading && <div className="ghn-loading">Đang tính...</div>}
      {fee !== null && !loading && (
        <div className="ghn-result">
          Phí giao hàng: {typeof fee === 'number' ? fee.toLocaleString() + ' đ' : fee}
        </div>
      )}
    </div>
  );
}
