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
  unstyled: bool,
}

const Link = ({
  children,
  color = "purple",
  external = false,
  onClick = () => {},
  to,
  unstyled = false,
}: Props) => {
  const anchor = to && to.includes("#");

  const props = {
    className: cx(`link-color--${color}`, { external, anchor, unstyled }),
    onClick,
  };

  if (!to) {
    return <a {...props}>{children}</a>;
  }


  if (anchor) {
    return <HashLink smooth {...props} to={to}>{children}</HashLink>;
  }

  return external
    ? <a {...props} href={to} target="_blank" rel="noopener noreferrer">{children}</a>
    : <RouterLink {...props} to={to}>{children}</RouterLink>;
};

export default Link;
