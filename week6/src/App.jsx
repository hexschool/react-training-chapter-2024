import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
} from "react-router-dom";
import Home from "./views/front/Home";
import Product from "./views/front/Products";
import Login from "./views/front/Login";
import Cart from "./views/front/Cart";
import SingleProduct from "./views/front/SingleProduct";
import NotFound from "./views/front/NotFound";
import AdminProduct from "./views/admin/AdminProducts";
import AdminOrder from "./views/admin/AdminOrders";

const AdminLayout = () => {
  return (
    <div>
      <nav>
        <Link className="h4 mt-5 mx-2" to="/admin/products">
          後台產品頁面
        </Link>
        <Link className="h4 mt-5 mx-2" to="/admin/orders">
          訂單頁面
        </Link>
      </nav>
      <Outlet />
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    console.log("Login successful, isLoggedIn:", isLoggedIn);
  };

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <Router>
      {!isAdminRoute && (
        <nav className="mt-5">
          <>
            <Link className="h4 mt-5 mx-2" to="/">
              首頁
            </Link>
            <Link className="h4 mt-5 mx-2" to="/product">
              產品頁面
            </Link>
            <Link className="h4 mt-5 mx-2" to="/cart">
              購物車頁面
            </Link>
            <Link className="h4 mt-5 mx-2" to="/login">
              登入頁面
            </Link>
          </>
        </nav>
      )}

      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/product/:id" element={<SingleProduct />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="products" element={<AdminProduct />} />
          <Route path="orders" element={<AdminOrder />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
