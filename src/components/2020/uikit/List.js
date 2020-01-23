// @flow

import React from "react";
import cx from "classnames";

type Props = {
  children: any,
  horizontal: bool,
  numbered: bool,
}

const List = ({
  children,
  horizontal = false,
  numbered = false,
}: Props) => React.createElement(
  numbered ? "ol" : "ul",
  {
    className: cx("list", {
      "list--horizontal": horizontal,
    }),
  },
  children,
);

export default List;
