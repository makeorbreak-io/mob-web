// @flow

import React from "react";
import cx from "classnames";

type ButtonProps = {
  children: string,
  inverted: bool,
  size: "regular" | "large" | "small" | "chevron",
  type: "primary" | "secondary" | "tertiary",
  onClick: () => void,
}

const Button = ({
  children,
  inverted = false,
  onClick = () => {},
  size,
  type,
}: ButtonProps) => {
  return (
    <button className={cx(size, type, { inverted })} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
