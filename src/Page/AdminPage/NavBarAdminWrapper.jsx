import { useParams } from "react-router-dom";
import Dashboard from "./ComponentPage/Dashboard";
import Store from "./ComponentPage/Store";
import Posts from "./ComponentPage/Posts";
import Customers from "./ComponentPage/Customers";
import Payments from "./ComponentPage/Payments";
import Orders from "./ComponentPage/Orders";
import Reviews from "./ComponentPage/Reviews";
import Support from "./ComponentPage/Support";
import Members from "./ComponentPage/Members";
import Settings from "./ComponentPage/Settings";
import DetailShop from "./ComponentPage/DetailShop";
import NavBarAdmin from "../../Layout/NavBarAdmin";
import DetailProduct from "./ComponentPage/DetailProduct";

export default function NavBarAdminWrapper() {
  const { section } = useParams();

  const componentMap = {
    dashboard: Dashboard,
    store: Store,
    posts: Posts,
    customers: Customers,
    payments: Payments,
    orders: Orders,
    reviews: Reviews,
    support: Support,
    members: Members,
    settings: Settings,
    detail: DetailShop,
    detailproducts : DetailProduct,
  };

  const SelectedComponent = componentMap[section] || Dashboard;

  return <NavBarAdmin Component={SelectedComponent} />;
}
