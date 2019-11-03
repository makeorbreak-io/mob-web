import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { compose } from "recompose";
import classnames from "classnames";

//
// hooks
import useOnClickOutside from "hooks/onClickOutside";

//
// enhancers
import { withCurrentUser, waitForData } from "enhancers";

//
// constants
import { ADMIN } from "constants/roles";

export const AccountMenu = ({
  data,
  data: { me },
}) => {
  const ref = useRef();
  const [isOpen, setIsOpen] = useState(false);

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

        {me.role === ADMIN && <Link to="/admin" onClick={close}>Admin</Link>}

        <a onClick={logout}>Logout</a>
      </div>
    </div>
  );
};
export default compose(
  withCurrentUser,
  waitForData,
)(AccountMenu);
