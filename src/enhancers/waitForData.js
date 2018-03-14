import React from "react";

import { branch, renderComponent } from "recompose";
import { get } from "lodash";

const Empty = () => <div />;

const waitForData = branch(
  props => {
    const networkStatus = get(props, "data.networkStatus", -1);

    return ![4, 6, 7].includes(networkStatus);
  },
  renderComponent(Empty),
);

export default waitForData;
