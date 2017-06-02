import "./styles";

import React, { Component } from "react";
import { Link } from "react-router";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";

//
// Components
import { Tabs, Tab, Panel } from "uikit/tabs";
import Login from "components/login";
import Signup from "components/signup";

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
    : (
        <div className="Home">
          <Tabs>
            <Tab><span>Sign In</span></Tab>
            <Tab>
              <span>Want to join our event?</span>
              <span>Sign Up</span>
            </Tab>

            <Panel><Login /></Panel>
            <Panel><Signup /></Panel>
          </Tabs>
        </div>
      );
  }

}

export default compose(
  setDisplayName("Home"),

  connect(({ currentUser }) => ({ currentUser })),
)(Home);
