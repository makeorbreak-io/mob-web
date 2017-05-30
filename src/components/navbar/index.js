import "./styles";

import React, { Component } from "react";
import { compose, setDisplayName, mapProps } from "recompose";
import { connect } from "react-redux";
import { isNull } from "lodash";

//
// Components
import { Button } from "uikit";
import AccountMenu from "components/account_menu";
import NotificationCenter from "components/notification_center";

export class Navbar extends Component {

  state = {
    menuVisible: false,
  }

  toggleAccountMenu = () => {
    const { menuVisible } = this.state;
    this.setState({ menuVisible: !menuVisible });
  }

  render() {
    const { currentUser, displayName } = this.props;
    const { menuVisible } = this.state;

    return (
      <div className="Navbar">
        {currentUser && <NotificationCenter />}

        <Button
          className="AccountMenuToggle"
          onClick={this.toggleAccountMenu}
          success
          hollow
        >
          {currentUser && displayName}
          {!currentUser && "Login"}
        </Button>

        <AccountMenu isOpen={menuVisible} />
      </div>
    );
  }

}

export default compose(
  setDisplayName("Navbar"),

  connect(({ currentUser }) => ({ currentUser })),

  mapProps(({ currentUser }) => ({
    currentUser,
    displayName: isNull(currentUser) ? "" : (currentUser.first_name || currentUser.email),
  })),
)(Navbar);
