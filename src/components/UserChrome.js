import React from "react";

import AccountSettings from "components/AccountSettings";

export const UserChrome = ({ children }) => (
  <div className="UserChrome">
    <div className="content white">
      <div className="UserCrome-left">
        <AccountSettings />
      </div>

      <div className="UserCrome-right">{children}</div>
    </div>
  </div>
);

export default UserChrome;
