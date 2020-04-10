// @flow

import React from "react";
import cx from "classnames";

type Props = {
  children: string,
  disabled: bool,
  inverted: bool,
  level: "primary" | "secondary" | "tertiary",
  size: "regular" | "large" | "small" | "chevron",
  onClick: () => void,
  type: "button" | "submit" | "reset",
}

const Button = ({
  children,
  disabled = false,
  inverted = false,
  level,
  onClick = () => {},
  size,
  type = "button",
}: Props) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={cx(size, level, { inverted })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
