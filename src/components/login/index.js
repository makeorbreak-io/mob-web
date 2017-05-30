import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Field, reduxForm } from "redux-form";

//
// Components
import Button from "uikit/button";
import ErrorMessage from "uikit/error_message";

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
    return this.props.dispatch(login(values.email, values.password));
  }

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <div className="Login">
        <form onSubmit={handleSubmit(this.onLogin)}>
          <div>
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
            fullwidth
            disabled={submitting}
            loading={submitting}
          >
            Login
          </Button>
        </form>

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
)(Login);

