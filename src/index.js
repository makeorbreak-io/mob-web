import React from "react";
import { render } from "react-dom";
import Raven from "raven-js";

//
// Components
import { AppContainer } from "react-hot-loader";
import { Provider } from "react-redux";
import AppLoader from "core/app_loader";
import router from "./router";

//
// Redux
import store from "redux-root/store";
import { performSetup } from "actions/setup";

//
// Config
import env from "environment";

// init redux
store.dispatch(performSetup());

// init Sentry error logging
Raven.config(env.sentryEndpoint).install();

render(
  (
    <Provider store={store}>
      <AppLoader>
        <AppContainer>
          {router}
        </AppContainer>
      </AppLoader>
    </Provider>
  ),
  document.getElementById("app"),
);
