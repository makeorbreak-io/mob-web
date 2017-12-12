import "./styles";
import "./styles.responsive";

import React, { Component } from "react";
import classnames from "classnames";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";
import { isEmpty } from "lodash";

//
// Components
import Notification from "./notification";

export class NotificationCenter extends Component {

  render() {
    const { notifications } = this.props;

    const cx = classnames("NotificationCenter", {
      "with-notifications": !isEmpty(notifications),
    });

    return (
      <div className={cx}>
        <div className="Notifications">
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
)(NotificationCenter);
