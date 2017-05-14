import "assets/normalize";
import "./styles";

import React from "react";
import { compose, setDisplayName } from "recompose";

//
// Components
import Navbar from "components/navbar";

export const App = ({ children }) => {
  return (
    <div className="App">
      <Navbar />

      <div className="content">
        {children}
      </div>
    </div>
  )
}

export default compose(
  setDisplayName("App"),
)(App);
