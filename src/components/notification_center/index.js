import "./styles";

import React, { Component } from "react";
import classnames from "classnames";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import onClickOutside from "react-onclickoutside";

//
// Components
import Notification from "./notification";

export class NotificationCenter extends Component {

  state = {
    isOpen: false,
  }

  componentWillReceiveProps(nextProps) {
    if (isEmpty(nextProps.notifications)) this.setState({ isOpen: false });
  }

  //----------------------------------------------------------------------------
  // Callbacks
  //----------------------------------------------------------------------------
  toggleList = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleClickOutside = () => {
    this.setState({ isOpen: false });
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { notifications } = this.props;
    const { isOpen } = this.state;

    const cx = classnames("NotificationCenter", {
      "with-notifications": !isEmpty(notifications),
    });

    const listCx = classnames("Notifications", {
      visible: isOpen,
    });

    return (
      <div className={cx}>
        <div className="Bell" onClick={this.toggleList}>
          <span className="Counter">{notifications.length}</span>
        </div>

        <div className={listCx}>
          {notifications.length === 0 &&
            <Notification
              title="No Notifications"
              message="You have no notifications!"
            />
          }
          {notifications.map(notification => (
            <Notification key={notification.id} {...notification} />
          ))}
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("NotificationCenter"),

  connect(({ notifications }) => ({ notifications })),

  onClickOutside,
)(NotificationCenter);
