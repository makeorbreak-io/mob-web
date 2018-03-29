import React from "react";

import AccountSettings from "components/AccountSettings";

export const UserChrome = ({ children }) => (
  <div className="UserChrome">
    <div className="content white">
      <div className="UserChrome-left">
        <AccountSettings />
      </div>

      <div className="UserChrome-right">{children}</div>
    </div>
  </div>
);

export default UserChrome;
