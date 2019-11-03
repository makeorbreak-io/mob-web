import React from "react";
import { compose } from "recompose";
import { Field, reduxForm } from "redux-form";
import { Link, useHistory } from "react-router-dom";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

//
// Enhancers
import { withCurrentUser } from "enhancers";

//
// Components
import {
  Button,
  buttonPropsFromReduxForm,
  ErrorMessage,
} from "components/uikit";
import { Tabs, Tab, Panel } from "components/uikit/tabs";

//
// lib
import { handleGraphQLErrors } from "lib/graphql";

//
// Validation
import {
  composeValidators,
  validateEmail,
  validatePresence,
  validateMatch,
  validateChecked,
} from "validators";

const validate = (values) => {
  return composeValidators(
    validateEmail("email", "Email"),
    validatePresence("password", "Password"),
    validateMatch("password_confirmation", "Password confirmation", { match: values.password }),
    validateChecked("tos", "Terms of Use"),
  )(values);
};

export const Signup = ({
  data,
  register,
  handleSubmit,
}) => {
  const history = useHistory();

  const submit = ({ email, password }) => (
    register({ variables: { email: email.trim.toLowerCase(), password } })
      .then((response) => localStorage.setItem("jwt", response.data.register))
      .then(() => data.refetch())
      .then(() => history.push("/welcome"))
      .catch(handleGraphQLErrors)
  );

  return (
    <div className="content white">
      <div className="narrow-container">
        <Tabs>
          <Tab>
            <span>Want to join our event?</span>
            <span>Sign Up</span>
          </Tab>
          <Panel>
            <div className="Signup">
              <form onSubmit={handleSubmit(submit)}>
                <div>
                  <label htmlFor="email">Email</label>
                  <Field
                    id="email"
                    name="email"
                    component="input"
                    type="text"
                    placeholder="Email"
                    className="fullwidth"
                  />
                  <ErrorMessage form="signup" field="email" />
                </div>

                <div>
                  <label htmlFor="password">Password</label>
                  <Field
                    id="password"
                    name="password"
                    component="input"
                    type="password"
                    placeholder="Password"
                    className="fullwidth"
                  />
                  <ErrorMessage form="signup" field="password" />
                </div>

                <div>
                  <label htmlFor="password_confirmation">Confirm your password</label>
                  <Field
                    id="password_confirmation"
                    name="password_confirmation"
                    component="input"
                    type="password"
                    placeholder="Password"
                    className="fullwidth"
                  />
                  <ErrorMessage form="signup" field="password_confirmation" />
                </div>

                <div>
                  <label htmlFor="tos" className="text">
                    <Field id="tos" name="tos" component="input" type="checkbox" />
                    I have read and accepted the general
                    &nbsp;<a href="https://makeorbreak.io/terms-of-service/">Terms of Use</a>
                  </label>
                  <ErrorMessage form="signup" field="tos" />
                </div>

                <Button
                  {...buttonPropsFromReduxForm(this.props)}
                  type="submit"
                  primary
                  form
                  centered
                  fullwidth
                  feedbackFailureLabel="Error creating account"
                >
                  Sign Up
                </Button>
              </form>

              <p className="small-notice">
                Already have an account? <Link to="/signin">Sign in</Link>
              </p>
            </div>
          </Panel>
        </Tabs>
      </div>
    </div>
  );
};

export default compose(
  reduxForm({
    form: "signup",
    validate,
  }),

  withCurrentUser,

  graphql(
    gql`mutation register($email: String!, $password: String!) {
      register(email: $email, password: $password)
    }
    `,
    { name: "register" },
  ),
)(Signup);
