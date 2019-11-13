// @flow

import React from "react";

type ButtonProps = {
  children: string,
  size: "regular" | "large" | "small" | "chevron",
  type: "primary" | "secondary" | "tertiary",
  onClick: () => void,
}

const Button = ({
  children,
  size,
  type,
  onClick = () => {},
}: ButtonProps) => {
  return (
    <button className={`${size} ${type}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
