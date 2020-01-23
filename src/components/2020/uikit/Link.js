// @flow

import * as React from "react";
import { Link as RouterLink  } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import cx from "classnames";

type Props = {
  children: string,
  color: "gray" | "white" | "purple",
  external: bool,
  onClick: () => void,
  to: string,
}

const Link = ({
  children,
  color = "purple",
  external = false,
  onClick = () => {},
  to,
}: Props) => {
  const anchor = to.startsWith("#");

  const props = {
    className: cx(`link-color--${color}`, { external, anchor }),
    onClick,
  };

  if (anchor) {
    return <HashLink {...props} to={to}>{children}</HashLink>;
  }

  return external
    ? <a {...props} href={to} target="_blank" rel="noopener noreferrer">{children}</a>
    : <RouterLink {...props} to={to}>{children}</RouterLink>;
};

export default Link;
