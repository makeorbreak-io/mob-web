import "assets/normalize";
import "./styles";

import React from "react";
import { compose, setDisplayName, lifecycle } from "recompose";
import { connect } from "react-redux";
import { isNull } from "lodash";

//
// Components
import Navbar from "components/navbar";

//
// Redux
import { logout } from "actions/authentication";
import { setCurrentUser } from "actions/current_user";

//
// HTTP
import request from "util/http";

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

  connect(),

  lifecycle({
    componentWillMount() {
      const { dispatch } = this.props;

      request.get("/me")
      .then(response => {
        const { data } = response.data;

        if (isNull(data)) {
          dispatch(logout());
        } else {
          dispatch(setCurrentUser(data));
        }
      })
      .catch(() => {
        dispatch(logout());
      });
    },
  }),
)(App);
