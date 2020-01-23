// @flow

import React from "react";
import cx from "classnames";

type Props = {
  background: "black" | "white" | "purple" | "cyan" | "aqua" | "beige",
  center: bool,
  children: any,
}

const Section = ({
  background = "white",
  center = false,
  children,
}: Props) => (
  <section className={cx(`background--${background}`, { center })}>
    {children}
  </section>
);

export default Section;
