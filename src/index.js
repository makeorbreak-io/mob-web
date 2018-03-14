// styles
import "assets/reset";
import "react-select/dist/react-select.css";
import "styles/application";

// shims
import "core-js/fn/array/flat-map";

import React from "react";
import { render } from "react-dom";
import Raven from "raven-js";

//
// Components
import { AppContainer } from "react-hot-loader";
import { Provider } from "react-redux";
import AppLoader from "components/AppLoader";
import router from "./router";

//
// Redux
import store from "store";
import { performSetup } from "actions/setup";

//
// Apollo
import gqlClient from "gqlClient";
import { ApolloProvider } from "react-apollo";

//
// Config
import env from "config/environment";
import { initGA } from "analytics/index";

// init redux
store.dispatch(performSetup());

// init Sentry error logging
Raven.config(env.sentryEndpoint).install();

// init Google Analytics
if (process.env.NODE_ENV === "production") {
  initGA();
}

render(
  (
    <Provider store={store}>
      <ApolloProvider client={gqlClient}>
        <AppLoader>
          <AppContainer>
            {router}
          </AppContainer>
        </AppLoader>
      </ApolloProvider>
    </Provider>
  ),
  document.getElementById("app"),
);
