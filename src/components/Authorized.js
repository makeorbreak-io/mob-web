import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useCurrentUser } from "hooks";

import { ADMIN } from "constants/roles";

const Authorized = ({ children }) => {
  const history = useHistory();
  const { loading, data } = useCurrentUser();

  useEffect(() => {
    if (!loading && data?.me?.role !== ADMIN) history.replace("/");
  }, [loading, data?.me]);

  return data?.me?.role === ADMIN ? children : null;
};

export default Authorized;
