import React from "react";
import { render } from "react-dom";

//
// Components
import { AppContainer } from "react-hot-loader";
import { Provider } from "react-redux";
import router from "./router";

//
// Redux
import store from "redux-root/store";

render(
  <AppContainer>
    <Provider store={store}>
      {router}
    </Provider>
  </AppContainer>,
  document.getElementById("app"),
);
