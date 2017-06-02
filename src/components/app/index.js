import "assets/reset";

import "react-select/dist/react-select.css";

import "./styles";
import "./forms";

import React from "react";
import { compose, setDisplayName } from "recompose";

//
// Components
import Navbar from "components/navbar";
import Footer from "components/footer";

export const App = ({ children }) => {
  return (
    <div className="App">
      <Navbar />

      <div className="AppContent">
        {children}
      </div>

      <Footer />
    </div>
  );
};

export default compose(
  setDisplayName("App"),
)(App);
