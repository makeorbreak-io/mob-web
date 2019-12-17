// @flow

import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

type Props = {
  children: string,
  external: bool,
  to: string,
}

const Link = ({
  children,
  external = false,
  to,
}: Props) => (
  external
  ? <a className="external" href={to} target="_blank" rel="noopener noreferrer">{children}</a>
  : <RouterLink to={to}>{children}</RouterLink>
);

export default Link;
