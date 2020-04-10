import gql from "graphql-tag";

import { fullUser } from "fragments";

export const CURRENT_USER = gql`
  query me {
    me { ...fullUser }
  }
  ${fullUser}
`;
