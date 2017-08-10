import "assets/reset";

import "react-select/dist/react-select.css";

import "./styles";
import "./forms";
import "./styles.responsive";

import React from "react";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";
import { isEmpty } from "lodash";

//
// Components
import Navbar from "components/navbar";
import Footer from "components/footer";

export const App = ({ children, location: { pathname }, currentUser }) => {
  return (
    <div className="App">
      <Navbar green={pathname === "/" && isEmpty(currentUser)} />

      <div className="AppContent">
        {children}
      </div>

      <Footer />
    </div>
  );
};

export default compose(
  setDisplayName("App"),

  connect(({ currentUser }) => ({ currentUser })),
)(App);
