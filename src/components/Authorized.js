import React from "react";
import { compose, setDisplayName, lifecycle } from "recompose";
import { withRouter } from "react-router";

import { withCurrentUser, waitForData } from "enhancers";

import { ADMIN } from "constants/roles";

export const Authorized = ({ data: { me }, children }) => (me && me.role === ADMIN ? children : <div />);

export default compose(
  setDisplayName("Authorized"),

  withRouter,

  withCurrentUser,
  waitForData,

  lifecycle({
    componentWillMount() {
      const { data: { me }, router } = this.props;
      if (!me || me.role !== ADMIN) router.push("/");
    },

    componentWillReceiveProps(nextProps) {
      const { data: { me }, router } = nextProps;
      if (!me || me.role !== ADMIN) router.push("/");
    },
  }),
)(Authorized);
