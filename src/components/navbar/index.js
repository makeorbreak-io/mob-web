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
import NotificationCenter from "components/notification_center";

//
// Assets
import logo from "assets/images/mob-logo-white.svg";

export class Navbar extends Component {

  state = {
    menuVisible: false,
  }

  toggleAccountMenu = () => {
    const { menuVisible } = this.state;
    this.setState({ menuVisible: !menuVisible });
  }

  render() {
    const { currentUser, green } = this.props;
    const cx = classnames("Navbar", {
      green,
      "logged-in": !isEmpty(currentUser),
    });

    return (
      <div className={cx}>
        <div className="content">
          <h1 className="Logo">
            <Link to="/">
              <img src={logo} alt="Make or Break." height="26" />
            </Link>
          </h1>

          {!currentUser && <Link activeClassName="active" className="login" to="/signin"><Button nobg>Sign In</Button></Link>}
          {!currentUser && <a href="#get-notified" className="signup"><Button cta>Notify Me</Button></a>}

          {currentUser && <NotificationCenter />}
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
    green: PropTypes.bool.isRequired,
  }),

  defaultProps({
    green: false,
  }),
)(Navbar);
