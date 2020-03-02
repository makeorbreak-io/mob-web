// @flow

import React from "react";
import cx from "classnames";

type Props = {
  children: React.Node,
  color: "black" | "white" | "purple" | "cyan" | "aqua",
  background: "white" | "yellow" | "pink" | "green" | "red" | "blue",
}

// wrapped span with a div due to flexbox shenanigans
const Tag = ({
  centered = false,
  children,
  color = "black",
  background = "white",
}: Props) => (
  <span className={cx(`tag background--${background} text-color--${color}`, { centered })}>
    {children}
  </span>
);

export default Tag;
