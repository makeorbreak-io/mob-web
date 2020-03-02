// @flow

import React from "react";
import cx from "classnames";

type Props = {
  background: "black" | "white" | "purple" | "cyan" | "aqua" | "beige",
  center: bool,
  children: any,
  id: string,
}

const Section = ({
  background = "white",
  center = false,
  children,
  id,
}: Props) => (
  <section className={cx(`background--${background}`, { center, [`section-${id}`]: id })}>
    {id && <div id={id} className="section__anchor" />}
    {children}
  </section>
);

export default Section;
