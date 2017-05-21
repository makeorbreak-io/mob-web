import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import Promise from "bluebird";

//
// Components
import Button from "uikit/button";
import ErrorMessage from "uikit/error_message";

//
// Utils
import request, { processSubmissionError } from "util/http";

//
// Redux
import { setJWT } from "actions/authentication";
import { setCurrentUser } from "actions/current_user";

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

  componentWillMount() {
    this.props.initialize({
      email: "joao.gradim@gmail.com",
      password: "password",
    });
  }

  onSignup = (values) => {
    const { dispatch } = this.props;

    return new Promise((resolve, reject) => {
      request.post("users", {
        user: values,
      })
      .then(response => {
        const { jwt, user } = response.data.data;

        dispatch(setJWT(jwt));
        dispatch(setCurrentUser(user));

        return resolve();
      })
      .catch(error => reject(processSubmissionError(error)));
    });
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
