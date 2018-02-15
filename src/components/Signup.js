import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, getContext } from "recompose";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router";
import { connect } from "react-redux";

//
// Components
import {
  Button,
  buttonPropsFromReduxForm,
  ErrorMessage,
} from "components/uikit";
import { Tabs, Tab, Panel } from "components/uikit/Tabs";

//
// Redux
import { signup } from "actions/authentication";

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

export class Signup extends Component {

  onSignup = (values) => {
    const { email, password } = values;

    return this.props
      .dispatch(signup(email.trim().toLowerCase(), password))
      .then(() => {
        this.props.router.push("/welcome");
        return Promise.resolve();
      });
  }

  render() {
    const { handleSubmit } = this.props;

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
  <div className="content white">
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
  </div>
));
