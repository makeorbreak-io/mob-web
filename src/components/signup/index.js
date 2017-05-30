import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";

//
// Components
import Button from "uikit/button";
import ErrorMessage from "uikit/error_message";

//
// Redux
import { signup } from "actions/authentication";

//
// Validation
import { composeValidators, validatePresence } from "validators";

const validate = (values) => {
  return composeValidators(
    validatePresence("email", "Email"),
    validatePresence("password", "Password"),
  )(values);
};

export class Signup extends Component {

  onSignup = (values) => {
    const { email, password } = values;

    return this.props.dispatch(signup(email, password));
  }

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <div className="Signup">
        <form onSubmit={handleSubmit(this.onSignup)}>
          <div>
            <Field
              name="email"
              component="input"
              type="text"
              placeholder="Email"
              className="fullwidth"
            />
            <ErrorMessage form="signup" field="email" />
          </div>

          <div>
            <Field
              name="password"
              component="input"
              type="password"
              placeholder="Password"
              className="fullwidth"
            />
            <ErrorMessage form="signup" field="password" />
          </div>

          <Button
            type="submit"
            primary
            fullwidth
            disabled={submitting}
            loading={submitting}
          >
            Register
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
)(Signup);
