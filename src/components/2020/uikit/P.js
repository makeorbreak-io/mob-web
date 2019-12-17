// @flow

import * as React from "react";
import cx from "classnames";

type Props = {
  children: React.Node,
  color: "black" | "white",
  large: bool,
}

const P = ({
  children,
  color = "black",
  large = false,
}: Props) => (
  <p className={cx(`text-color--${color}`, { large })}>
    {children}
  </p>
);

export default P;
