// @flow

import React from "react";
import cx from "classnames";

type Props = {
  children: string,
  inverted: bool,
  level: "primary" | "secondary" | "tertiary",
  size: "regular" | "large" | "small" | "chevron",
  onClick: () => void,
}

const Button = ({
  children,
  inverted = false,
  level,
  onClick = () => {},
  size,
}: Props) => {
  return (
    <button className={cx(size, level, { inverted })} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
