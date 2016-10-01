import React from "react";
import { compose, setDisplayName } from "recompose";

export const App = () => {
  return (
    <div className="App">
      APP GOES HERE!
    </div>
  )
}

export default compose(
  setDisplayName("App"),
)(App);
