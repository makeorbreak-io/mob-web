import "./styles"

import React, { Component } from "react";
import Promise from "bluebird";
import { compose, setDisplayName } from "recompose";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { map } from "lodash";

//
// Components
import Button from "uikit/button";
import ErrorMessage from "uikit/error_message";

//
// HTTP
import request, { processSubmissionError } from "util/http";

//
// Redux
import { setCurrentUser } from "actions/current_user";

//
// Constants
import { EMPLOYMENT_STATUS } from "constants/account_settings";

//
// Validation
import { composeValidators, validatePresence } from "validators";

const validate = (values) => {
  return composeValidators(
    validatePresence("first_name", "First name"),
    validatePresence("last_name", "Last name"),
    validatePresence("email", "Email"),
  )(values);
};

export class AccountSettings extends Component {

  onSubmit = (values) => {
    const { dispatch, currentUser: { id } } = this.props;

    return new Promise((resolve, reject) => {
      return request.put(`/users/${id}`, {
        user: values
      })
      .then((response) => {
        const user = response.data.data;
        dispatch(setCurrentUser(user));

        return resolve();
      })
      .catch(error => reject(processSubmissionError(error)));
    });
  }

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <div className="AccountSettings">
        <h1>Account Settings</h1>

        <form onSubmit={handleSubmit(this.onSubmit)}>

          {/* Personal Info */}
          <div className="FormSectionHeader">Personal Info</div>
          <Field name="first_name" component="input" type="text" placeholder="First name" className="left" />
          <Field name="last_name" component="input" type="text" placeholder="Last name" className="right" />
          <ErrorMessage left form="account-settings" field="first_name" />
          <ErrorMessage right form="account-settings" field="last_name" />

          <Field name="email" component="input" type="text" placeholder="Email" className="fullwidth" />
          <ErrorMessage form="account-settings" field="email" />

          <Field name="birthday" component="input" type="text" placeholder="Birthday" className="fullwidth" />
          <ErrorMessage form="account-settings" field="birthday" />

          <Field name="bio" component="textarea" placeholder="Bio" className="fullwidth" />
          <ErrorMessage form="account-settings" field="bio" />

          {/* Social Media */}
          <div className="FormSectionHeader">Social Media</div>
          <Field name="github_handle" component="input" type="text" placeholder="Github handle" className="fullwidth icon github" />
          <ErrorMessage form="account-settings" field="github_handle" />

          <Field name="twitter_handle" component="input" type="text" placeholder="Twitter handle" className="fullwidth icon twitter" />
          <ErrorMessage form="account-settings" field="twitter_handle" />

          {/* Employment and Education */}
          <div className="FormSectionHeader">Employement and Education</div>
          <Field name="college" component="input" type="text" placeholder="College" className="fullwidth" />
          <ErrorMessage form="account-settings" field="college" />

          <Field name="employment_status" component="select" className="fullwidth">
            <option value="" disabled>Employement Status</option>
            {map(EMPLOYMENT_STATUS, (label, status) =>
              <option key={status} value={status}>{label}</option>
            )}
          </Field>
          <ErrorMessage form="account-settings" field="employment_status" />

          <Field name="company" component="input" type="text" placeholder="Company" className="fullwidth" />
          <ErrorMessage form="account-settings" field="company" />

          <Button primary form type="submit" disabled={submitting} loading={submitting}>
            Update
          </Button>
        </form>
      </div>
    );
  }

}

export default compose(
  setDisplayName("AccountSettings"),

  connect(({ currentUser }) => ({
    currentUser,
    initialValues: currentUser,
  })),

  reduxForm({
    form: "account-settings",
    validate,
  }),
)(AccountSettings);