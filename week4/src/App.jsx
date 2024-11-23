import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './views/Login';
import Product from './views/Product';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/product" element={<Product />} />
      </Routes>
    </Router>
  );
}

export default App;