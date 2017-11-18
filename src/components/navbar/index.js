import "./styles";
import "./styles.responsive";

import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import { connect } from "react-redux";
import { Link } from "react-router";
import { isEmpty } from "lodash";

//
// Components
import { Button } from "uikit";
import AccountMenu from "components/account_menu";
import Drawer from "components/drawer";

//
// Assets
import logo from "assets/images/mob-logo-white.svg";

export class Navbar extends Component {

  render() {
    const { currentUser, landing } = this.props;
    const cx = classnames("Navbar", {
      landing,
      "logged-in": !isEmpty(currentUser),
      "logged-out": isEmpty(currentUser),
    });

    return (
      <div className={cx}>
        <div className="content">
          {currentUser && !landing && <Drawer />}

          <h1 className="Logo">
            <Link to="/">
              <img src={logo} alt="Make or Break." height="26" />
            </Link>
          </h1>

          {!currentUser && <Link activeClassName="active" className="login" to="/signin"><Button nobg>Sign In</Button></Link>}

          {currentUser && <AccountMenu />}
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("Navbar"),

  connect(({ currentUser }) => ({ currentUser })),

  setPropTypes({
    landing: PropTypes.bool.isRequired,
  }),

  defaultProps({
    green: false,
  }),
)(Navbar);
