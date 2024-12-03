import Home from "./views/front/Home";
import Login from "./views/front/Login";
import NotFound from "./views/front/NotFound";
import Product from "./views/front/Products";
import Cart from "./views/front/Cart";
import SingleProduct from "./views/front/SingleProduct";

import FrontendLayout from "./layout/FrontendLayout"; // 前台 Layout
import AdminLayout from "./layout/AdminLayout"; // 後台 Layout
import AdminProducts from "./views/admin/AdminProducts";
import AdminOrders from "./views/admin/AdminOrders";

const routes = (handleLoginSuccess) => [
  {
    path: "/",
    element: <FrontendLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/product",
        element: <Product />,
      },
      {
        path: "/product/:id",
        element: <SingleProduct />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/login",
        element: <Login onLoginSuccess={handleLoginSuccess} />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
