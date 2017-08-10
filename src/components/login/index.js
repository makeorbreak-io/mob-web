import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, getContext } from "recompose";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router";

//
// Components
import Button from "uikit/button";
import ErrorMessage from "uikit/error_message";
import { Tabs, Tab, Panel } from "uikit/tabs";

//
// Redux
import { login } from "actions/authentication";

//
// Validation
import { composeValidators, validatePresence } from "validators";

const validate = (values) => {
  return composeValidators(
    validatePresence("email", "Email"),
    validatePresence("password", "Password"),
  )(values);
};

export class Login extends Component {

  onLogin = (values) => {
    const { dispatch, router } = this.props;
    return dispatch(login(values.email, values.password))
    .then(() => router.push("/"));
  }

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <div className="Login">
        <form onSubmit={handleSubmit(this.onLogin)}>
          <div>
            <label htmlFor="email">Email</label>
            <Field
              name="email"
              component="input"
              type="text"
              placeholder="Email"
              className="fullwidth"
            />
            <ErrorMessage form="login" field="email" />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <Field
              name="password"
              component="input"
              type="password"
              placeholder="Password"
              className="fullwidth"
            />
            <ErrorMessage form="login" field="password" />
          </div>

          <Button
            type="submit"
            primary
            form
            centered
            halfwidth
            disabled={submitting}
            loading={submitting}
          >
            Sign In
          </Button>
        </form>

        <p className="small-notice">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>

      </div>
    );
  }

}

export default compose(
  setDisplayName("Login"),

  getContext({
    router: PropTypes.object.isRequired,
  }),

  reduxForm({
    form: "login",
    validate,
  }),
)(Login);

export const StandaloneLogin = compose(
  setDisplayName("StandaloneLogin"),

  getContext({
    router: PropTypes.object.isRequired,
  }),

  reduxForm({
    form: "login",
    validate,
  }),
)((props) => (
  <div className="narrow-container">
    <Tabs>
      <Tab><span>Sign In</span></Tab>
      <Panel>
        <Login {...props} />
      </Panel>
    </Tabs>
  </div>
));
