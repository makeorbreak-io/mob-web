import React from "react";
import { useLocation } from "react-router-dom";

import Navbar from "components/Navbar";
import Footer from "components/Footer";
import { Toaster } from "components/uikit";

const App = ({
  children,
}) => {
  const location = useLocation();

  return (
    <div className="App">
      <Navbar
        landing={location.pathname === "/"}
        fly={location.pathname === "/fly"}
      />

      {children}

      <Toaster />

      <Footer />
    </div>
  );
};

export default App;
