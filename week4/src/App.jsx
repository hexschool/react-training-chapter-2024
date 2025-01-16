import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { Modal } from "bootstrap";
import ProductModal from "./component/ProductModal";
import Pagination from "./component/Pagination";

import "./assets/style.css";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "";

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});

  const productModalRef = useRef(null);
  const [modalType, setModalType] = useState("");
  const [templateData, setTemplateData] = useState({
    id: "",
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    originPrice: 0,
    price: 0,
    description: "",
    content: "",
    isEnabled: false,
    imagesUrl: [],
  });

  const openModal = (product, type) => {
    setTemplateData({
      id: product.id || "",
      imageUrl: product.imageUrl || "",
      title: product.title || "",
      category: product.category || "",
      unit: product.unit || "",
      originPrice: product.originPrice || 0,
      price: product.price || 0,
      description: product.description || "",
      content: product.content || "",
      isEnabled: product.isEnabled || false,
      imagesUrl: product.imagesUrl || [],
    });
    productModalRef.current.show();
    setModalType(type);
  };

  const handleFileChange = async (e) => {
    const url = `${API_BASE}/api/${API_PATH}/admin/upload`;

		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const formData = new FormData();
			formData.append("file-to-upload", file);

			let res = await axios.post(url, formData);
      const uploadedImageUrl = res.data.imageUrl;

      setTemplateData((prevTemplateData) => ({
        ...prevTemplateData,
        imageUrl: uploadedImageUrl,
      }));
		} catch (error) {
			console.error("Upload error:", error);
		}
	};

  const closeModal = () => {
    productModalRef.current.hide();
  };

  const updateProductData = async (id) => {
    let product;
    if (modalType === "edit") {
      product = `product/${id}`;
    } else {
      product = `product`;
    }

    const url = `${API_BASE}/api/${API_PATH}/admin/${product}`;
    const productData = {
      data: {
        ...templateData,
        origin_price: Number(templateData.originPrice),
        price: Number(templateData.price),
        is_enabled: templateData.isEnabled ? 1 : 0,
        imageUrl: templateData.imageUrl,
      },
    };

    try {
      if (modalType === "edit") {
        await axios.put(url, productData);
      } else {
        await axios.post(url, productData);
      }

      productModalRef.current.hide();
      getProducts();
    } catch (err) {
      if (modalType === "edit") {
        alert(`編輯失敗：${err.response.data.message}`);
      } else {
        alert(`建立失敗：${err.response.data.message}`);
      }
    }
  };

  const delProductData = async (id) => {
    try {
      `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
      productModalRef.current.hide();
      getProducts();
    } catch (err) {
      alert(`刪除失敗：${err.response.data.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setTemplateData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (index, value) => {
    setTemplateData((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages[index] = value;

      if (
        value !== "" &&
        index === newImages.length - 1 &&
        newImages.length < 5
      ) {
        newImages.push("");
      }

      if (newImages.length > 1 && newImages[newImages.length - 1] === "") {
        newImages.pop();
      }

      return { ...prevData, imagesUrl: newImages };
    });
  };

  const handleAddImage = () => {
    setTemplateData((prevData) => ({
      ...prevData,
      imagesUrl: [...prevData.imagesUrl, ""],
    }));
  };

  const handleRemoveImage = () => {
    setTemplateData((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages.pop();
      return { ...prevData, imagesUrl: newImages };
    });
  };

  const checkLogin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      getProducts();
      setIsAuth(true);
    } catch (err) {
      console.log(err);
    }
  };

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`
      );
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.log(err);
    }
  };

  const signIn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)}`;
      axios.defaults.headers.common.Authorization = `${token}`;

      getProducts();
      setIsAuth(true);
      setFormData({});
    } catch (err) {
      alert(`登入失敗：${err.response.data.message}`);
    }
  };

  useEffect(() => {
    productModalRef.current = new Modal("#productModal", {
      keyboard: true,
      backdrop: "static",
    });

    const token = document.cookie
      ?.split(";")
      .find((token) => token.startsWith("hexToken="))
      ?.split("=")[1];

    if (token) {
      axios.defaults.headers.common.Authorization = `${token}`;
      checkLogin();
    }
  }, []);

  return (
    <>
      {isAuth ? (
        <div>
          <div className="container">
            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-primary"
                onClick={() => openModal("", "new")}
              >
                建立新的產品
              </button>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th width="120">分類</th>
                  <th>產品名稱</th>
                  <th width="120">原價</th>
                  <th width="120">售價</th>
                  <th width="100">是否啟用</th>
                  <th width="120">編輯</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.category}</td>
                    <td>{product.title}</td>
                    <td className="text-end">{product.origin_price}</td>
                    <td className="text-end">{product.price}</td>
                    <td>
                      {product.is_enabled ? (
                        <span className="text-success">啟用</span>
                      ) : (
                        <span>未啟用</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => openModal(product, "edit")}
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => openModal(product, "delete")}
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination pagination={pagination} changePage={getProducts} />
          </div>
        </div>
      ) : (
        <div className="container login mt-5">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={signIn}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
      <ProductModal
        modalType={modalType}
        templateData={templateData}
        onCloseModal={closeModal}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onImageChange={handleImageChange}
        onAddImage={handleAddImage}
        onRemoveImage={handleRemoveImage}
        onUpdateProduct={updateProductData}
        onDeleteProduct={delProductData}
      />
    </>
  );
}

export default App;
