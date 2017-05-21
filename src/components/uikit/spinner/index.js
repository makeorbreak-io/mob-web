import "./styles";

import React from "react";
import { compose, setDisplayName } from "recompose";

export const Spinner = () => (<div className="Spinner" />);

export default compose(
  setDisplayName("Spinner"),
)(Spinner);
