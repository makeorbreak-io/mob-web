import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

//
// Components
import App from "components/app";

const router = (
  <Router>
    <Route path="/" component={App} />
  </Router>
);

export default router;
