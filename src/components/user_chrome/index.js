import "./styles";
import "./styles.responsive";

import React, { Component } from "react";
import { compose } from "recompose";

import AccountSettings from "components/account_settings";

export class UserChrome extends Component {

  render() {
    const { children } = this.props;

    return (
      <div className="UserChrome">
        <div className="content white">
          <div className="UserCrome-left">
            <AccountSettings />
          </div>

          <div className="UserCrome-right">{children}</div>
        </div>
      </div>
    );
  }

}

export default compose(
)(UserChrome);
