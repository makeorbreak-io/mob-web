import React from "react";

import Header from "components/2020/Header";
import Footer from "components/2020/Footer";

import { Toaster } from "components/uikit";

const App = ({
  children,
}) => {
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
