import React from "react";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";

//
// Components
import Landing from "components/landing";
import Dashboard from "components/dashboard";

export const Home = ({ currentUser }) => (currentUser ? <Dashboard /> : <Landing />);

export default compose(
  setDisplayName("Home"),

  connect(({ currentUser }) => ({ currentUser })),
)(Home);
