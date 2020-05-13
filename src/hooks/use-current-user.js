import { useQuery } from "@apollo/react-hooks";

import { CURRENT_USER } from "queries";

const useCurrentUser = () => useQuery(CURRENT_USER);

export default useCurrentUser;
