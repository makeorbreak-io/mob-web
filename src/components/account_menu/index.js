import "./styles";

import React, { Component } from "react";
import { Link } from "react-router";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";
import classnames from "classnames";
import onClickOutside from "react-onclickoutside";

//
// Components
import { Button } from "uikit";

//
// Redux
import { logout } from "actions/authentication";

//
// Util
import { displayName } from "util/user";

export class AccountMenu extends Component {
  state = {
    open: false,
  }

  //----------------------------------------------------------------------------
  // Event handlers
  //----------------------------------------------------------------------------
  handleClickOutside = () => {
    this.close();
  }

  close = () => {
    this.setState({ open: false });
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { open } = this.state;
    const { currentUser, dispatch } = this.props;
    const cx = classnames("AccountMenu", { open });

    return (
      <div className={cx}>
        <Button success className="AccountMenuToggle" onClick={() => this.setState({ open: !open })}>
          {displayName(currentUser)}
        </Button>

        <div className="AccountMenuContent">
          <Link to="/account/settings" onClick={this.close}>Account Settings</Link>
          <Link to="/account/team" onClick={this.close}>Team</Link>
          <Link onClick={() => dispatch(logout())}>Logout</Link>
        </div>
      </div>
    );
  }
}

export default compose(
  setDisplayName("AccountMenu"),

  connect(({ currentUser }) => ({ currentUser })),

  onClickOutside,
)(AccountMenu);
