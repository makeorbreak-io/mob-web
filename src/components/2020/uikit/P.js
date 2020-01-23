// @flow

import * as React from "react";
import cx from "classnames";

type Props = {
  additional: bool,
  centered: bool,
  children: React.Node,
  color: "black" | "white",
  large: bool,
}

const P = ({
  additional = false,
  centered = false,
  children,
  color = "black",
  large = false,
}: Props) => (
  <p className={cx(`text-color--${color}`, { large, centered, additional })}>
    {children}
  </p>
);

export default P;
