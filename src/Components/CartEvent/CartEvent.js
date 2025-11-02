import React, { useState, useEffect } from "react";
import { Button, Dropdown, Badge, message } from "antd";
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./cart.css";
import { useNavigate } from "react-router-dom";

const CartEven = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const loadCart = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  };

  useEffect(() => {
    loadCart();
    const handleCartChange = () => loadCart();
    window.addEventListener("cart-updated", handleCartChange);
    return () => window.removeEventListener("cart-updated", handleCartChange);
  }, []);

  const updateCart = (newCart) => {
    // CHỈ CHO PHÉP 1 SẢN PHẨM TRONG GIỎ HÀNG
    if (newCart.length > 1) {
      message.error("Chỉ được thêm 1 sản phẩm duy nhất!");
      return; // Không lưu nếu vượt quá 1
    }

    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart-updated"));
  };
  const increaseQuantity = (index) => {
    const newCart = [...cartItems];
    newCart[index].quantity += 1;
    updateCart(newCart);
  };

  const decreaseQuantity = (index) => {
    const newCart = [...cartItems];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
      updateCart(newCart);
    }
  };

  const removeItem = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    updateCart(newCart);
  };

  const cartMenuItems = cartItems.length
    ? [
        ...cartItems.map((item, index) => ({
          key: index,
          label: (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                maxWidth: 350,
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
              <div style={{ fontSize: 12, flex: 1 }}>
                <div title={item.name}>
                  <strong>
                    {item.name.length > 20
                      ? item.name.slice(0, 20) + "..."
                      : item.name}
                  </strong>
                </div>
                <div>Giá: {item.price.toLocaleString()}₫</div>
                <div>Số lượng: {item.quantity || "—"}</div>
                <div>Size: {item.size || "—"}</div>
              </div>
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => removeItem(index)}
              />
            </div>
          ),
        })),
        {
          key: "view-all",
          label: (
            <div style={{ textAlign: "center" }}>
              <Button
                type="primary"
                size="small"
                onClick={() => (
                  navigate("/payment")
                )}
              >
                Xem tất cả
              </Button>
            </div>
          ),
        },
      ]
    : [{ key: "0", label: "Giỏ hàng trống" }];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginLeft: "15%",
      }}
    >
      <Dropdown menu={{ items: cartMenuItems }} placement="bottomRight" arrow>
        <span>
          <Badge count={cartItems.length} color="red">
            <Button
              type="text"
              icon={
                <ShoppingCartOutlined
                  style={{ fontSize: "32px", color: "white" }}
                />
              }
            />
          </Badge>
        </span>
      </Dropdown>
    </div>
  );
};

export default CartEven;
