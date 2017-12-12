import "./styles";
import "./styles.responsive";

import React, { Component } from "react";
import classnames from "classnames";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";
import { Link } from "react-router";

//
// Components
import AccountSettings from "components/account_settings";

//
// Assets
import logo from "assets/images/mob-logo-white.svg";

export class Drawer extends Component {

  state = {
    open: false,
  }

  openDrawer = () => this.setState({ open: true });
  closeDrawer = () => this.setState({ open: false });

  render() {
    const { open } = this.state;

    const overlayCx = classnames("Drawer-overlay", { open });
    const contentCx = classnames("Drawer-content", { open });

    return (
      <div className="Drawer">
        <div className="Drawer-toggle" onClick={this.openDrawer} />

        <div className={overlayCx} onClick={this.closeDrawer} />
        <div className={contentCx}>
          <div className="Drawer-content-header">
            <h1>
              <Link to="/" onClick={this.closeDrawer}>
                <img src={logo} alt="Make or Break." height="20" />
              </Link>
            </h1>
          </div>

          <div className="Drawer-content-scrollable">
            <AccountSettings />
          </div>
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("Navbar"),

  connect(({ currentUser }) => ({ currentUser })),
)(Drawer);
