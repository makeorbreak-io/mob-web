// @flow

import * as React from "react";
import cx from "classnames";

type Props = {
  centered: bool,
  children: React.Node,
  color: "black" | "white",
  large: bool,
}

const P = ({
  centered = false,
  children,
  color = "black",
  large = false,
}: Props) => (
  <p className={cx(`text-color--${color}`, { large, centered })}>
    {children}
  </p>
);

export default P;
