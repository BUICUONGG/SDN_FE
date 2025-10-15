import React, { useState } from "react";
import { useSelector } from "react-redux";
import UserDrop from "./UserDrop";
import { UserOutlined } from "@ant-design/icons";
import ModalUser from "../Modal/ModalUser";

export default function UserMenu() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const openModal = () => setIsOpenModal(true);
  const closeModal = () => setIsOpenModal(false);
  let userInfo = useSelector((state) => {
    return state.userReducer.userInfo;
  });

  let renderContent = () => {
    if (userInfo) {
      return (
        <>
          <UserDrop user={userInfo} />
        </>
      );
    } else {
      return (
        <>
          <div style={{display: 'flex', marginLeft: '20px'}}>
            <UserOutlined style={{ fontSize: "22px", color: "white" }} />
            <button
              onClick={openModal} // Gọi hàm mở modal
              style={{
                fontSize: "12px",
                background: "#6EB566",
                borderRadius: "10px",
                color: "white",
                outline: "none",
                border: 'none',
                lineHeight: '12px'
              }}
            >
              Đăng nhập/Đăng ký
            </button>
          </div>

          <ModalUser isOpen={isOpenModal} onClose={closeModal} />
        </>
      );
    }
  };
  return <div>{renderContent()}</div>;
}
