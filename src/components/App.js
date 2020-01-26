import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Header from "components/2020/Header";
import Footer from "components/2020/Footer";

import { Toaster } from "components/uikit";

const App = ({
  children,
}) => {
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) {
      document.scrollingElement.scrollTop = 0;
    }
  }, [location]);

  return (
    <div className="App">
      <div className="layout">
        <Header />

        <div className="layout__content">
          {children}
        </div>

        <Toaster />

        <Footer />
      </div>
    </div>
  );
};

export default App;
