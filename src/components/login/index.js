import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Field, reduxForm, SubmissionError } from "redux-form";
import Promise from "bluebird";

//
// Components
import Button from "uikit/button";
import ErrorMessage from "uikit/error_message";

//
// Redux
import { setJWT } from "actions/authentication";
import { setCurrentUser } from "actions/current_user";

//
// Utils
import request from "util/http";

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

  componentWillMount() {
    this.props.initialize({
      email: "joao.gradim@gmail.com",
      password: "password",
    });
  }

  onLogin = (values) => {
    const { dispatch } = this.props;

    return new Promise((resolve, reject) => {
      return request.post("login", {
        ...values,
      })
      .then(response => {
        const { jwt, user } = response.data.data;

        dispatch(setJWT(jwt));
        dispatch(setCurrentUser(user));

        return resolve();
      })
      .catch(() => {
        return reject(new SubmissionError({ password: "Invalid credentials" }));
      });
    });
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

