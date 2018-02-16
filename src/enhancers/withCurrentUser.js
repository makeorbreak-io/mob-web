import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { fullUser } from "fragments";

export default graphql(gql`{ me { ...fullUser } } ${fullUser}`);
