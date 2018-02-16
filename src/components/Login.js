import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Field, reduxForm } from "redux-form";
import { Link, withRouter } from "react-router";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { withCurrentUser } from "enhancers";

import { handleGraphQLErrors } from "lib/graphql";

//
// Components
import {
  Button,
  buttonPropsFromReduxForm,
  ErrorMessage,
  FormErrorMessage,
} from "components/uikit";
import { Tabs, Tab, Panel } from "components/uikit/Tabs";

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
    const { router, data, authenticate } = this.props;

    return authenticate({
      variables: { email: email.trim().toLowerCase(), password },
    })
    .then(response => {
      localStorage["jwt"] = response.data.authenticate;
      data.refetch();
      router.push("/dashboard");
    })
    .catch(handleGraphQLErrors);
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="content white">
        <div className="narrow-container">
          <Tabs>
            <Tab><span>Sign In</span></Tab>
            <Panel>
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
                  <FormErrorMessage form="login" />
                </form>

                <p className="small-notice">
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </p>

                <p className="small-notice">
                  Forgot your password? <Link to="/recover-password">Recover it</Link>
                </p>

              </div>
            </Panel>
          </Tabs>
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("Login"),

  reduxForm({
    form: "login",
    validate,
  }),

  withRouter,

  withCurrentUser,

  graphql(
    gql`mutation authenticate($email: String!, $password: String!) {
      authenticate(email: $email, password: $password)
    }`,
    { name: "authenticate" },
  ),
)(Login);
