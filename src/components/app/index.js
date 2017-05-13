import "assets/normalize";
import "./styles";

import React from "react";
import { Link } from "react-router";
import { compose, setDisplayName } from "recompose";

export const App = () => {
  return (
    <div className="App">
      <Link to="signup">Signup</Link>
    </div>
  )
}

export default compose(
  setDisplayName("App"),
)(App);
