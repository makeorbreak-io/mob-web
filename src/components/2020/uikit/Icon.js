// @flow

import React from "react";

type Props = {
  color: "main" | "footer",
  type: "email" | "facebook" | "medium" | "twitter",
};

const Icon = ({
  color = "main",
  type,
}: Props) => (
  <div className={`icon icon--${type} icon--color--${color}`} />
);

export default Icon;
