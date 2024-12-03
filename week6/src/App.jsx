import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes";
import { useState } from "react";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    console.log(isLoggedIn)
  };

  return (
    <Router>
      <Routes>
        {routes(handleLoginSuccess).map((route, index) => (
          <Route key={index} path={route.path} element={route.element}>
            {route.children &&
              route.children.map((child, childIndex) => (
                <Route
                  key={childIndex}
                  path={child.path}
                  element={child.element}
                />
              ))}
          </Route>
        ))}
      </Routes>
    </Router>
  );
};

export default App;
