// styles
import "assets/reset";
import "react-select/dist/react-select.css";
import "styles/application";

// shims
import "core-js/es/array/flat-map";

import React from "react";
import { render } from "react-dom";
import Raven from "raven-js";

//
// Components
import { Provider } from "react-redux";
import AppLoader from "components/AppLoader";
import Router from "./router";

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
          <Router />
        </AppLoader>
      </ApolloProvider>
    </Provider>
  ),
  document.getElementById("root"),
);
