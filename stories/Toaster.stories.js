import React from "react";
import { Toaster } from "../src/components/uikit/Toaster";

export default {
  title: "Toaster",
};

export const toaster = () => {
  const toasts = [
    {
      id: "1",
      content: "Toasterino contenterino",
    },
    {
      id: "2",
      content: "Toasterino second contenterino",
    },
  ];

  return <Toaster toasts={toasts}/>;
};
