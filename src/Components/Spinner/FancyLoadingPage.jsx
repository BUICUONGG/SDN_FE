import React, { useEffect, useState } from "react";
import "./FancyLoadingPage.css";
import { BsCart, BsCartCheckFill } from "react-icons/bs";
import { PiShirtFoldedFill } from "react-icons/pi";

export default function FancyLoadingPage() {
  const [showCheckedCart, setShowCheckedCart] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCheckedCart(true);
    }, 2000); // Sau 2s thì đổi icon

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="cart-animation-container">
      <div className="product-icon">
        <PiShirtFoldedFill />
      </div>

      <div className="cart-icon">
        {showCheckedCart ? (
          <BsCartCheckFill size={80} color="#25BA4D" />
        ) : (
          <BsCart size={80} />
        )}
      </div>

      <div className="xmark-text">xmark
        <span className="loading-dots"></span>
      </div>

    </div>
  );
}
