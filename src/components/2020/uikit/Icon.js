// @flow

import React from "react";

type IconProps = {
  color: "default" | "footer",
  type: "email" | "facebook" | "medium" | "twitter",
};

const Icon = ({
  color = "main",
  type,
}: IconProps) => (
  <div className={`icon icon--${type} icon--color--${color}`} />
);

export default Icon;
