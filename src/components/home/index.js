import "./styles";
import "./styles.responsive";

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
          <p>
            Head over to your <Link to="/profile">profile</Link> and fill it out, help us to know you better!
          </p>
          <p>
            Check out your <Link to="/account/team">team</Link>, and invite your friends!
          </p>
          <p>
            Workshops are coming soon!
          </p>
        </div>
      )
    : <Landing />;
  }

}

export default compose(
  setDisplayName("Home"),

  connect(({ currentUser }) => ({ currentUser })),
)(Home);
