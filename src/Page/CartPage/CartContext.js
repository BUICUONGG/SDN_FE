import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.variantId === product.variantId
      );

      let updatedCart;
      if (existingIndex !== -1) {
        updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += 1;
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }

      // ✅ Phát sự kiện sau khi cập nhật cart
      setTimeout(() => {
        window.dispatchEvent(new Event("cart-updated"));
      }, 0);

      return updatedCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
