import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Field, reduxForm } from "redux-form";
import { isEmpty } from "lodash";

//
// Components
import ErrorMessage from "components/error_message";

//
// Utils
import axios from "util/axios";

//
// Validation
const validate = (values) => {
  const errors = {};

  if (isEmpty(values.email)) {
    errors.email = "Email is required";
  }

  if (isEmpty(values.password)) {
    errors.password = "Password is required";
  }

  return errors;
}

export class Signup extends Component {

  onSignup = (values) => {
    axios.post("users", {
      user: values,
    })
    .then(response => console.log("success!", response))    // eslint-disable-line no-console
    .catch(response => console.log("failure!", response));  // eslint-disable-line no-console
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="Signup">
        <form onSubmit={handleSubmit(this.onSignup)}>
          <div>
            <label htmlFor="email">Email</label>
            <Field name="email" component="input" type="text" />
            <ErrorMessage form="signup" field="email" />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <Field name="password" component="input" type="password" />
            <ErrorMessage form="signup" field="password" />
          </div>

          <div>
            <button type="submit">Register</button>
          </div>
        </form>

      </div>
    )
  }

}

export default compose(
  setDisplayName("Signup"),

  reduxForm({
    form: "signup",
    validate,
  }),
)(Signup);
