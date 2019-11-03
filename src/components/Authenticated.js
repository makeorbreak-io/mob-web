import { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { compose } from "recompose";

import { withCurrentUser, waitForData } from "enhancers";

const redirect = ({ history, location, me }) => {
  if (!me) history.replace("/");
  if (me && !localStorage.getItem("checked-privacy") && location.pathname !== "/welcome") history.replace("/welcome");
};

const Authenticated = ({
  children,
  data: { me },
}) => {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => redirect({ history, location, me }));

  return me ? children : null;
};

export default compose(
  withCurrentUser,
  waitForData,
)(Authenticated);
