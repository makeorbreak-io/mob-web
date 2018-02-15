import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, getContext } from "recompose";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

//
// Components
import {
  Button,
  buttonPropsFromReduxForm,
  ErrorMessage,
} from "uikit";
import { Tabs, Tab, Panel } from "uikit/tabs";

//
// Redux
// import { login } from "actions/authentication";

//
// Validation
import { composeValidators, validatePresence, validateEmail } from "validators";

const validate = (values) => {
  return composeValidators(
    validateEmail("email", "Email"),
    validatePresence("password", "Password"),
  )(values);
};

export class Login extends Component {

  onLogin = ({ email, password }) => {
    const { router, authenticate } = this.props;

    return authenticate({
      variables: { email: email.trim().toLowerCase(), password },
    })
    .then(response => {
      localStorage["jwt"] = response.data.authenticate;
      router.push("/dashboard");
    });

    // return dispatch(login(values.email.trim().toLowerCase(), values.password))
    // .then(() => router.push("/dashboard"));
  }

  render() {
    const { handleSubmit } = this.props;

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
            {...buttonPropsFromReduxForm(this.props)}
            type="submit"
            primary
            form
            centered
            fullwidth
            feedbackFailureLabel="Error signing in"
          >
            Sign In
          </Button>
        </form>

        <p className="small-notice">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>

        <p className="small-notice">
          Forgot your password? <Link to="/recover-password">Recover it</Link>
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

  graphql(
    gql`mutation authenticate($email: String!, $password: String!) {
      authenticate(email: $email, password: $password)
    }`,
    { name: "authenticate" },
  ),
)((props) => (
  <div className="content white">
    <div className="narrow-container">
      <Tabs>
        <Tab><span>Sign In</span></Tab>
        <Panel>
          <Login {...props} />
        </Panel>
      </Tabs>
    </div>
  </div>
));
