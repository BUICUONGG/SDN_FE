import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./Page/HomePage/HomePage";
import ErrorPage from "./Page/ErrolPage/ErrorPage";
import Layout from "./Layout/Layout";
import SettingPage from "./Page/UserPage/SettingPage";
import LayoutUser from "./Layout/LayoutUser";
import ProtectedRoute from "./Components/Protectedroute/ProtectedRoute";
import LoginPageTest from "./Page/AdminPage/LoginPageTest";
import AddressPage from "./Page/UserPage/AddressPage";
import RegisterSeller from "./Page/SellerPage/RegisterSeller";
import { notification } from "antd";
import ChangePass from "./Page/UserPage/ChangePass";
import DetailProduct from "./Page/DetailProduct/DetailProduct";
import BlogPage from "./Page/BlogPage/BlogPage";
import LayoutAdmin from "./Layout/LayoutAdmin";
import AdminPage from "./Page/AdminPage/AdminPage";
import NavBarAdminWrapper from "./Page/AdminPage/NavBarAdminWrapper";
import SellerPage from "./Page/SellerPage/SellerPage";
import Payment from "./Page/Payment/Payment";
import InvationBuy from "./Page/UserPage/InvationBuy";
import PaymentTest from "./Page/Payment/PaymentTest";
import NavbarSellerWrap from "./Page/SellerPage/NavbarSeller";
import LayoutCart from "./Layout/LayoutCart";
import LayoutPayment from "./Layout/LayoutPayment";
import TestPage from "./Page/TestPage/TestPage";
import ChatPage from "./Page/ChatBox/ChatPage";
import LayoutChat from "./Layout/LayoutChat";
import WaitForPayment from "./Page/Payment/WaitForPayment";
import FancyLoadingPage from "./Components/Spinner/FancyLoadingPage";
import TermsPage from "./Page/SubPage/TermsPage";
import PrivacyPage from "./Page/SubPage/PrivacyPage";
import PaymentNow from "./Page/Payment/PaymentNow";
import SearchResults from "./Page/SearchPage/SearchResults";
import OAuth2RedirectHandler from "./Page/OAuth2RedirectHandler";
import AutionPage from "./Page/AutionPage/AutionPage";
import AuctionDetail from "./Page/AutionPage/AutionDetail";
import CreateAuctionPage from "./Page/AutionPage/CreateAuctionPage";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [api, contextHolder] = notification.useNotification();

  // const openNotification = (type, message, description) => {
  //   api[type]({
  //     message: message,
  //     description: description,
  //   });
  // };
  // useEffect(() => {
  //   let violationCount = 0;
  //   // 🛑 Chặn phím tắt mở DevTools & View Source
  //   const handleKeyDown = (event) => {
  //     if (
  //       event.key === "F12" || 
  //       (event.ctrlKey && event.shiftKey && event.key === "I") || 
  //       (event.ctrlKey && event.key === "U") ||
  //       (event.ctrlKey && event.shiftKey && event.key === "J") // Chặn Ctrl+Shift+J (Console)
  //     ) {
  //       violationCount++;
  //       setAttempts(violationCount);
  //       openNotification(
  //         "warning",
  //         "Cảnh báo!",
  //         "🚨 Hệ thống đã chặn truy cập trái phép! 🚨"
  //       );
  //       if (violationCount >= 3) {
  //         alert("Hệ thống phát hiện hành vi đáng ngờ! Bạn sẽ bị chuyển hướng.");
  //         window.location.href = "https://www.tiktok.com/@nigauxam/video/7264434587726581000";
  //       }
  //       event.preventDefault();
  //     }
  //   };

  //   // 🛑 Chặn chuột phải
  //   const handleContextMenu = (event) => {
  //     event.preventDefault();
  //     violationCount++;
  //     setAttempts(violationCount);
  //     openNotification(
  //       "warning",
  //       "Cảnh báo!",
  //       "🚨 Bạn không được phép sử dụng chuột phải trên trang này!"
  //     );
  //     if (violationCount >= 3) {
  //       alert("Hệ thống phát hiện hành vi đáng ngờ! Bạn sẽ bị chuyển hướng.");
  //       window.location.href = "https://www.tiktok.com/@nigauxam/video/7264434587726581000";
  //     }
  //   };

  //   // 🛑 Phát hiện DevTools và chuyển hướng trang
  //   const detectDevTools = () => {
  //     const threshold = 160;
  //     if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
  //       openNotification(
  //         "warning",
  //         "Cảnh báo!",
  //         "🚨 Hệ thống phát hiện Developer Tools! Truy cập bị từ chối. 🚨"
  //       );
  //       window.location.href = "about:blank";
  //     }
  //   };

  //   const interval = setInterval(detectDevTools, 1000); // Kiểm tra DevTools mỗi giây

  //   // 🛑 Vô hiệu hóa inspect bằng console.log
  //   setInterval(() => {
  //     console.clear();
  //     console.log("%c🚨 Cảnh báo: Không được phép kiểm tra mã nguồn! 🚨", "color: red; font-size: 20px;");
  //   }, 1000);

  //   document.addEventListener("keydown", handleKeyDown);
  //   document.addEventListener("contextmenu", handleContextMenu);

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //     clearInterval(interval);
  //   };
  // }, []);

  return (
    <div>
      {contextHolder}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout Component={HomePage} />} />
          <Route path="/auction-channel" element={<Layout Component={AutionPage} />} />
          <Route path="/auction-channel/detail/:id" element={<Layout Component={AuctionDetail} />} />
          <Route path="/create-auction" element={<Layout Component={CreateAuctionPage} />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
          <Route path="/auth/google/callback" element={<OAuth2RedirectHandler />} />
          <Route path="/register-seller" element={<Layout Component={RegisterSeller} />} />
          <Route path="/settings" element={<ProtectedRoute><LayoutUser Component={SettingPage} /></ProtectedRoute>} />
          <Route path="/settings/address" element={<ProtectedRoute><LayoutUser Component={AddressPage} /></ProtectedRoute>} />
          <Route path="/settings/changepass" element={<ProtectedRoute><LayoutUser Component={ChangePass} /></ProtectedRoute>} />
          <Route path="/settings/buylist" element={<ProtectedRoute><LayoutUser Component={InvationBuy} /></ProtectedRoute>} />
          <Route path="/product/:id" element={<Layout Component={DetailProduct} />} />
          <Route path="/blog/blog1" element={<Layout Component={BlogPage} />} />
          <Route path="/cart" element={<LayoutCart Component={Payment} />} />
          <Route path="/payment" element={<LayoutPayment Component={PaymentTest} />} />
          <Route path="/payment-now" element={<LayoutPayment Component={PaymentNow} />} />
          <Route path="/admin-login" element={<LayoutAdmin Component={AdminPage} />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/1" element={<LoginPageTest />} />
          <Route path="/2" element={<FancyLoadingPage />} />
          <Route path="/search" element={<Layout Component={SearchResults} />} />
          <Route path="/chatbox" element={<LayoutChat Component={ChatPage} />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/wait-for-payment" element={<WaitForPayment />} />
          <Route path="/seller" element={<Layout Component={SellerPage} />} />
          <Route path="/admin-page" element={<Navigate to="/admin-page/dashboard" replace />} />
          <Route path="/seller-page" element={<Navigate to="/seller-page/restricted" />} />
          <Route path="/admin-page/:section" element={<NavBarAdminWrapper />} />
          <Route path="/admin-page/:section/:id?" element={<NavBarAdminWrapper />} />
          <Route path="/seller-page/:section" element={<NavbarSellerWrap />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
