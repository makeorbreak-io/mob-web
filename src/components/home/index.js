import "./styles";

import React, { Component } from "react";
import { Link } from "react-router";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";

//
// Components
import Landing from "components/landing";

export class Home extends Component {

  render() {
    const { currentUser } = this.props;

    return currentUser
    ? (
        <div className="Home">
          <h1>Welcome to Make or Break!</h1>
          <h4>There's not a lot going on yet...</h4>
          <h5>...but don't worry! We're working hard to bring you the best experience possible. Stay tuned!</h5>

          <h5>
            In the meantime, you can head over to your <Link to="/account/settings">account settings</Link>,
            or check out your <Link to="/account/team">team</Link>.
          </h5>
        </div>
      )
    : <Landing />;
  }

}

export default compose(
  setDisplayName("Home"),

  connect(({ currentUser }) => ({ currentUser })),
)(Home);
