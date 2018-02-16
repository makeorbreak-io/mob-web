import React, { Component } from "react";
import { Link } from "react-router";
import { compose, setDisplayName } from "recompose";
import classnames from "classnames";
import onClickOutside from "react-onclickoutside";

//
// enhancers
import { withCurrentUser, waitForData } from "enhancers";

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

  handleLogout = () => {
    const { data } = this.props;

    delete localStorage["jwt"];
    data.refetch();
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { open } = this.state;
    const { data: { me } } = this.props;
    const cx = classnames("AccountMenu", { open });

    return (
      <div className={cx}>
        <span className="AccountMenuToggle" onClick={() => this.setState({ open: !open })}>
          {me.displayName}
        </span>

        <div className="AccountMenuContent">
          <Link to="/dashboard" onClick={this.close}>Dashboard</Link>
          {me.role === ADMIN && <Link to="/admin" onClick={this.close}>Admin</Link>}
          <Link onClick={this.handleLogout}>Logout</Link>
        </div>
      </div>
    );
  }
}

export default compose(
  setDisplayName("AccountMenu"),

  withCurrentUser,

  waitForData,

  onClickOutside,
)(AccountMenu);
