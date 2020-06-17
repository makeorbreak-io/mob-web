// @flow

import React, { useState, useCallback } from "react";
import cx from "classnames";

type Props = {
  children: string,
  confirmation: string,
  disabled: bool,
  inverted: bool,
  level: "primary" | "secondary" | "tertiary",
  size: "regular" | "large" | "small" | "chevron",
  onClick: (Object) => Promise<any>,
  type: "button" | "submit" | "reset",
}

const Button = ({
  children,
  confirmation,
  disabled = false,
  inverted = false,
  level,
  onClick = () => Promise.resolve(),
  size,
  type = "button",
}: Props) => {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback((ev) => {
    if (confirmation && !window.confirm(confirmation)) return null;

    setLoading(true);

    onClick(ev)
      .finally(() => setLoading(false));
  });

  return (
    <button
      disabled={disabled}
      type={type}
      className={cx(size, level, { inverted, loading })}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Button;
