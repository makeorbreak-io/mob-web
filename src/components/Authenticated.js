import React from "react";
import { compose, setDisplayName, lifecycle } from "recompose";
import { withRouter } from "react-router";

import { withCurrentUser, waitForData } from "enhancers";

export const Authenticated = ({ data: { me }, children }) => (me ? children : <div />);

const redirect = (props) => {
  const { data: { me }, router } = props;
  const { pathname } = window.location;

  if (!me) router.push("/");
  if (me && !localStorage.getItem("checked-privacy") && pathname !== "/welcome") router.push("/welcome");
};

export default compose(
  setDisplayName("Authenticated"),

  withRouter,

  withCurrentUser,
  waitForData,

  lifecycle({
    componentWillMount() {
      redirect(this.props);
    },

    componentWillReceiveProps(nextProps) {
      redirect(nextProps);
    },
  }),
)(Authenticated);
