import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const API_BASE = "https://ec-course-api.hexschool.io/v2"

const AdminProduct = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = `${token}`;

    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);

    } catch (err) {
      navigate("/");
      alert(err.response.data.message);
    }
  };
  return (
    <div>
      <h1 className="mt-5">後台產品頁面</h1>
    </div>
  );
};


export default AdminProduct;