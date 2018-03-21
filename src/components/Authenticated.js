import React from "react";
import { compose, setDisplayName, lifecycle } from "recompose";
import { withRouter } from "react-router";

import { withCurrentUser, waitForData } from "enhancers";

export const Authenticated = ({ data: { me }, children }) => (me ? children : <div />);

export default compose(
  setDisplayName("Authenticated"),

  withRouter,

  withCurrentUser,
  waitForData,

  lifecycle({
    componentWillMount() {
      const { data: { me }, router } = this.props;

      if (!me) router.push("/");
    },

    componentWillReceiveProps(nextProps) {
      const { data: { me }, router } = nextProps;

      if (!me) router.push("/");
    },
  }),
)(Authenticated);
