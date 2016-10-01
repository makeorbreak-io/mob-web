import React from "react";
import { render } from "react-dom";

//
// Components
import { AppContainer } from "react-hot-loader";
import router from "./router";

render(
  <AppContainer>{router}</AppContainer>,
  document.getElementById("app"),
);
