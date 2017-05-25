import "./styles";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { map } from "lodash";

//
// Components
import {
  Button,
  ErrorMessage,
  FormSectionHeader,
} from "uikit";

//
// Redux
import { updateCurrentUser } from "actions/current_user";

//
// Constants
import { EMPLOYMENT_STATUS } from "constants/account_settings";
import { DATE_FORMAT } from "constants/date";

//
// Util
import { formatDate } from "util/date";

//
// Validation
import {
  composeValidators,
  validatePresence,
  validateDateFormat,
} from "validators";

const validate = (values) => {
  return composeValidators(
    validatePresence("first_name", "First name"),
    validatePresence("last_name", "Last name"),
    validatePresence("email", "Email"),
    validateDateFormat("birthday", "Birthday", { format: DATE_FORMAT }),
  )(values);
};

export class AccountSettings extends Component {

  onSubmit = (values) => {
    const { dispatch, currentUser: { id } } = this.props;

    return dispatch(updateCurrentUser(id, values));
  }

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <div className="AccountSettings">
        <h1>Account Settings</h1>

        <form onSubmit={handleSubmit(this.onSubmit)}>

          {/* Personal Info */}
          <FormSectionHeader>Personal Info</FormSectionHeader>
          <Field name="first_name" component="input" type="text" placeholder="First name" className="left" />
          <Field name="last_name" component="input" type="text" placeholder="Last name" className="right" />
          <ErrorMessage left form="account-settings" field="first_name" />
          <ErrorMessage right form="account-settings" field="last_name" />

          <Field name="email" component="input" type="text" placeholder="Email" className="fullwidth" />
          <ErrorMessage form="account-settings" field="email" />

          <Field
            name="birthday"
            component="input"
            type="text"
            placeholder={`Birthday (${DATE_FORMAT})`}
            className="fullwidth"
            format={formatDate}
            autoComplete="off"
          />
          <ErrorMessage form="account-settings" field="birthday" />

          <Field name="bio" component="textarea" placeholder="Bio" className="fullwidth" />
          <ErrorMessage form="account-settings" field="bio" />

          {/* Social Media */}
          <FormSectionHeader>Social Media</FormSectionHeader>
          <Field name="github_handle" component="input" type="text" placeholder="Github handle" className="fullwidth icon github" />
          <ErrorMessage form="account-settings" field="github_handle" />

          <Field name="twitter_handle" component="input" type="text" placeholder="Twitter handle" className="fullwidth icon twitter" />
          <ErrorMessage form="account-settings" field="twitter_handle" />

          {/* Employment and Education */}
          <FormSectionHeader>Employement and Education</FormSectionHeader>
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
