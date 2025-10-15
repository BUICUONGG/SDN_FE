import React, { useState } from "react";
import { useSelector } from "react-redux";
import UserDrop from "./UserDrop";
import { UserOutlined } from "@ant-design/icons";
import ModalUser from "../Modal/ModalUser";

export default function AdminMenu() {
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
        </>
      );
    }
  };
  return <div>{renderContent()}</div>;
}
