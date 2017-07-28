import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, getContext } from "recompose";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";

//
// Components
import Button from "uikit/button";
import ErrorMessage from "uikit/error_message";
import { Tabs, Tab, Panel } from "uikit/tabs";

//
// Redux
import { signup } from "actions/authentication";

//
// Validation
import {
  composeValidators,
  validatePresence,
  validateMatch,
  validateChecked,
} from "validators";

const validate = (values) => {
  return composeValidators(
    validatePresence("email", "Email"),
    validatePresence("password", "Password"),
    validateMatch("password_confirmation", "Password confirmation", { match: values.password }),
    validateChecked("tos", "Terms of Use"),
  )(values);
};

export class Signup extends Component {

  onSignup = (values) => {
    const { email, password } = values;

    return this.props
      .dispatch(signup(email, password))
      .then(() => {
        this.props.router.push("/welcome");
        return Promise.resolve();
      });
  }

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <div className="Signup">
        <form onSubmit={handleSubmit(this.onSignup)}>
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
              &nbsp;<a href="https://portosummerofcode.com/terms-of-service/">Terms of Use</a>
            </label>
            <ErrorMessage form="signup" field="tos" />
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
            Sign Up
          </Button>
        </form>

      </div>
    );
  }

}

export default compose(
  setDisplayName("Signup"),

  connect(),

  reduxForm({
    form: "signup",
    validate,
  }),

  getContext({
    router: PropTypes.object.isRequired,
  }),
)(Signup);

export const StandaloneSignup = compose(
  setDisplayName("StandaloneSignup"),

  connect(),

  reduxForm({
    form: "signup",
    validate,
  }),

  getContext({
    router: PropTypes.object.isRequired,
  }),
)((props) => (
  <div className="narrow-container">
    <Tabs>
      <Tab>
        <span>Want to join our event?</span>
        <span>Sign Up</span>
      </Tab>
      <Panel>
        <Signup {...props} />
      </Panel>
    </Tabs>
  </div>
));
