// @flow

import * as React from "react";
import cx from "classnames";

type Props = {
  centered: bool,
  children: React.Node,
  color: "black" | "white" | "purple" | "cyan" | "aqua",
  size: "s" | "m" | "l" | "xl",
}

const els = {
  s:  (c, p) => <h4 {...p}>{c}</h4>,
  m:  (c, p) => <h3 {...p}>{c}</h3>,
  l:  (c, p) => <h2 {...p}>{c}</h2>,
  xl: (c, p) => <h1 {...p}>{c}</h1>,
};

const Heading = ({
  centered = false,
  children,
  color = "black",
  size = "xl",
}: Props) => (
  els[size](children, {
    className: cx(`text-color--${color}`, { centered }),
  })
);

export default Heading;
