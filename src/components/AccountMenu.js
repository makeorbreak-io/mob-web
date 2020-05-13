import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";

//
// hooks
import {
  useCurrentUser,
  useOnClickOutside,
} from "hooks";

//
// constants
import { ADMIN } from "constants/roles";

export const AccountMenu = () => {
  const ref = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const { loading, data } = useCurrentUser();

  if (loading) return null;

  const close = () => setIsOpen(false);
  const logout = () => {
    delete localStorage["jwt"];
    data.refetch();
  };

  useOnClickOutside(ref, close);

  const cx = classnames("AccountMenu", { open: isOpen });

  return (
    <div className={cx} ref={ref}>
      <span className="AccountMenuToggle" onClick={() => setIsOpen(!isOpen)}>
        {data.me.displayName}
      </span>

      <div className="AccountMenuContent">
        <Link to="/dashboard" onClick={close}>Dashboard</Link>

        <Link to="/account/privacy" onClick={close}>Privacy</Link>

        {data.me.role === ADMIN && <Link to="/admin" onClick={close}>Admin</Link>}

        <a onClick={logout}>Logout</a>
      </div>
    </div>
  );
};

export default AccountMenu;
