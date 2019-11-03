import React, { Component } from "react";
import classnames from "classnames";
import { compose } from "recompose";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";

//
// Enhancers
import { withCurrentUser } from "enhancers";

//
// Components
import { Button } from "components/uikit";
import AccountMenu from "components/AccountMenu";
import Drawer from "components/Drawer";

//
// Assets
import logo from "assets/images/mob-logo-white.svg";

export class Navbar extends Component {
  render() {
    const { data: { me }, landing, fly } = this.props;
    const cx = classnames("Navbar", {
      landing,
      "logged-in": !isEmpty(me),
      "logged-out": isEmpty(me),
    });

    return (
      <div className={cx}>
        <div className="content">
          {me && !landing && <Drawer />}

          <h1 className="Logo">
            <Link to="/">
              <img src={logo} alt="Make or Break." height="26" />
            </Link>
          </h1>

          {!me && !fly && <Link className="login" to="/signin"><Button nobg>Sign In</Button></Link>}

          {me && !fly && <AccountMenu />}
        </div>
      </div>
    );
  }
}

export default compose(
  withCurrentUser,
)(Navbar);
