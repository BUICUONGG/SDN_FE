import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import HomeSeller from "./component/HomeSeller";
import NavbarSeller from "../../Layout/NavBarSeller";
import InvaSeller from "./component/InvaSeller";
import ProductSeller from "./component/ProductSeller";
import MarketingSeller from "./component/MarketingSeller";
import MessageSeller from "./component/MessageSeller";
import SettingSeller from "./component/SettingSeller";
import RestrictedAccess from "./component/RestrictedAccess";
import AllProduct from "./component/AllProduct";
import { appService } from "../../service/appService";

export default function NavbarSellerWrap() {
  const { section } = useParams();
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await appService.getDetailStoreUser();
        const status = response.data.metadata.verificationStatus;
        console.log("Verification status:", status);
        setVerificationStatus(status);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin cửa hàng:", error);
      }
    };

    fetchStoreDetails();
  }, []);

  const componentMap = {
    home: HomeSeller,
    invantion: InvaSeller,
    addProduct: ProductSeller,
    marketing: MarketingSeller,
    message: MessageSeller,
    setting: SettingSeller,
    // restricted: RestrictedAccess,
    product: AllProduct,
  };

  // Hiển thị loading trong khi chờ fetch API
  if (!verificationStatus) return <div>Loading...</div>;

  console.log("Section from URL:", section);
  console.log("Mapped component:", componentMap[section]);

  let SelectedComponent;

  if (verificationStatus === "PENDING") {
    SelectedComponent = componentMap[section] || RestrictedAccess;
  } else if (verificationStatus === "VERIFIED") {
    if (section === "restricted") {
      SelectedComponent = HomeSeller; // hoặc một component khác
    } else {
      SelectedComponent = componentMap[section] || HomeSeller;
    }
  } else {
    SelectedComponent = RestrictedAccess;
  }

  return <NavbarSeller Component={SelectedComponent} />;
}
