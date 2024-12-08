import { Outlet, Link } from "react-router-dom";

const FrontendLayout = () => {
  return (
    <div>
      <header>
        <nav className="mt-5">
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
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="mt-5 text-center">
        <p>© 2024 我的網站</p>
      </footer>
    </div>
  );
};

export default FrontendLayout;
