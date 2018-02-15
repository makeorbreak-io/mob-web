import React from "react";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";
import { pick } from "lodash";

export const AppLoader = ({ ready, children }) => (
  ready ? children : <div className="AppLoader" />
);

export default compose(
  setDisplayName("AppLoader"),

  connect(state => pick(state, "ready"))
)(AppLoader);
