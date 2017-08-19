import "./styles";

import React, { Component } from "react";
import { Link } from "react-router";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";
import classnames from "classnames";
import onClickOutside from "react-onclickoutside";

//
// Redux
import { logout } from "actions/authentication";

//
// constants
import { ADMIN } from "constants/roles";

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
        <span className="AccountMenuToggle" onClick={() => this.setState({ open: !open })}>
          {currentUser.display_name}
        </span>

        <div className="AccountMenuContent">
          <Link to="/" onClick={this.close}>Dashboard</Link>
          <Link to="/profile" onClick={this.close}>Profile</Link>
          <Link to="/account/team" onClick={this.close}>Team</Link>
          {currentUser.role === ADMIN && <Link to="/admin" onClick={this.close}>Admin</Link>}
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
