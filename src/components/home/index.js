import "./styles"

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";

export class Home extends Component {

  render() {
    return (
      <div className="Home">
      </div>
    );
  }

}

export default compose(
  setDisplayName("Home"),
)(Home);
