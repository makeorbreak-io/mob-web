import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, getContext, lifecycle } from "recompose";
import { connect } from "react-redux";

//
// constants
import { ADMIN } from "constants/roles";

export const Authorized = ({ currentUser, children }) => (currentUser.role === ADMIN ? children : <div />);

export default compose(
  setDisplayName("Authorized"),

  getContext({
    router: PropTypes.object.isRequired, 
  }),

  connect(({ currentUser }) => ({ currentUser })),

  lifecycle({
    componentWillMount() {
      const { currentUser, router } = this.props;
      if (currentUser.role !== ADMIN) router.push("/");
    },

    componentWillReceiveProps(nextProps) {
      const { currentUser, router } = nextProps;
      if (currentUser.role !== ADMIN) router.push("/");
    },
  }),
)(Authorized);
