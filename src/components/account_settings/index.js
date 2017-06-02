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
} from "uikit";
import { Tabs, Tab, Panel } from "uikit/tabs";

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
        <Tabs selected={0}>
          <Tab><span>Account settings</span></Tab>

          <Panel>

            <form onSubmit={handleSubmit(this.onSubmit)}>

              {/* Personal Info */}
              <label htmlFor="first_name">Name</label>
              <Field id="first_name" name="first_name" component="input" type="text" placeholder="First name" className="left" />
              <Field name="last_name" component="input" type="text" placeholder="Last name" className="right" />
              <ErrorMessage left form="account-settings" field="first_name" />
              <ErrorMessage right form="account-settings" field="last_name" />

              <label htmlFor="email">Email</label>
              <Field id="email" name="email" component="input" type="text" placeholder="Email" className="fullwidth" />
              <ErrorMessage form="account-settings" field="email" />

              <label htmlFor="birthday">Birthday</label>
              <Field
                id="birthday"
                name="birthday"
                component="input"
                type="text"
                placeholder={DATE_FORMAT}
                className="fullwidth"
                format={formatDate}
                autoComplete="off"
              />
              <ErrorMessage form="account-settings" field="birthday" />

              <label htmlFor="bio">Short Bio</label>
              <Field id="bio" name="bio" component="textarea" placeholder="Bio" className="fullwidth" />
              <ErrorMessage form="account-settings" field="bio" />

              {/* Social Media */}
              <label htmlFor="github_handle">Social Media</label>
              <Field id="github_handle" name="github_handle" component="input" type="text" placeholder="Github handle" className="fullwidth icon github" />
              <ErrorMessage form="account-settings" field="github_handle" />

              <Field name="twitter_handle" component="input" type="text" placeholder="Twitter handle" className="fullwidth icon twitter" />
              <ErrorMessage form="account-settings" field="twitter_handle" />

              {/* Employment and Education */}
              <label htmlFor="college">Employment and Education</label>
              <Field id="college" name="college" component="input" type="text" placeholder="College" className="fullwidth" />
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

              <Button primary form centered fullwidth type="submit" disabled={submitting} loading={submitting}>
                Update
              </Button>
            </form>

          </Panel>
        </Tabs>

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
