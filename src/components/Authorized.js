import { useEffect } from "react";
import { compose } from "recompose";
import { useHistory } from "react-router-dom";

import { withCurrentUser, waitForData } from "enhancers";

import { ADMIN } from "constants/roles";

const redirect = ({ history, me }) => {
  if (me?.role !== ADMIN) history.replace("/");
};

const Authorized = ({
  children,
  data: { me },
}) => {
  const history = useHistory();

  useEffect(() => redirect({ history, me }));

  return me?.role === ADMIN ? children : null;
};

export default compose(
  withCurrentUser,
  waitForData,
)(Authorized);
