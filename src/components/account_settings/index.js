import "./styles";

import React, { Component, Fragment } from "react";
import { compose, setDisplayName } from "recompose";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { map } from "lodash";
import classnames from "classnames";

//
// Components
import {
  Button,
  buttonPropsFromReduxForm,
  ErrorMessage,
} from "uikit";

//
// Redux
import { updateCurrentUser } from "actions/current_user";

//
// Constants
import { EMPLOYMENT_STATUS } from "constants/account_settings";
import { DATE_FORMAT } from "constants/date";
import { TSHIRT_SIZES } from "constants/user";

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

const validate = ({ name, ...rest }) => {
  const values = {
    first_name: name.split(/\s+/)[0],
    last_name: name.split(/\s+/)[1],
    ...rest,
  };

  return composeValidators(
    validatePresence("first_name", "First name"),
    validatePresence("email", "Email"),
    validatePresence("tshirt_size", "T-Shirt size"),

    validateDateFormat("birthday", "Birthday", { format: DATE_FORMAT }),
  )(values);
};

export class AccountSettings extends Component {

  state = {
    editing: false,
  }

  handleToggle = () => {
    const { editing } = this.state;

    if (editing) {
      this.submitButton.click();
    }
    else {
      this.setState({ editing: true });
    }

  }

  onSubmit = (values) => {
    const { dispatch, currentUser: { id } } = this.props;

    return dispatch(updateCurrentUser(id, values)).finally(() => this.setState({ editing: false }));
  }

  render() {
    const { handleSubmit, currentUser } = this.props;
    const { editing } = this.state;

    const formCx = classnames({ editing });

    return (
      <div className="AccountSettings">
        <h2>
          <span>You</span>

          {editing &&
            <Button
              small
              onClick={() => this.setState({ editing: false })}
            >
              Cancel
            </Button>
          }

          <Button
            {...buttonPropsFromReduxForm(this.props)}
            primary
            small
            feedbackSuccessLabel="Updated!"
            feedbackFailureLabel="Error updating"
            onClick={this.handleToggle}
          >
            {editing ? "Update" : "Edit"}
          </Button>
        </h2>

        {editing &&
          <form onSubmit={handleSubmit(this.onSubmit)} className={formCx}>
            {/* Personal Info */}
            <div className="form-row">
              <label htmlFor="name">Name</label>
              <Field id="name" name="name" component="input" type="text" placeholder="Name" className="fullwidth" disabled={!editing}/>
              <ErrorMessage form="account-settings" field="name" />
            </div>

            <div className="form-row">
              <label htmlFor="email">Email</label>
              <Field id="email" name="email" component="input" type="text" placeholder="Email" className="fullwidth" disabled={!editing} />
              <ErrorMessage form="account-settings" field="email" />
            </div>

            <div className="form-row">
              <label htmlFor="tshirt_size">T-Shirt Size</label>
              <Field id="tshirt_size" name="tshirt_size" component="select" className="fullwidth" disabled={!editing}>
                <option value="" disabled>Choose your t-shirt size</option>
                {TSHIRT_SIZES.map(size =>
                  <option key={size} value={size}>{size}</option>
                )}
              </Field>
              <ErrorMessage form="account-settings" field="tshirt_size" />
            </div>

            <div className="form-row">
              <label htmlFor="birthday">Birthday</label>
              <Field id="birthday" name="birthday" component="input" type="text" placeholder={DATE_FORMAT} className="fullwidth" format={formatDate} autoComplete="off" disabled={!editing} />
              <ErrorMessage form="account-settings" field="birthday" />
            </div>

            <div className="form-row">
              <label htmlFor="bio">Short Bio</label>
              <Field id="bio" name="bio" component="textarea" placeholder="Bio" className="fullwidth" disabled={!editing} />
              <ErrorMessage form="account-settings" field="bio" />
            </div>

            {/* Social Media */}
            <div className="form-row">
              <label htmlFor="github_handle">Social Media</label>
              <Field id="github_handle" name="github_handle" component="input" type="text" placeholder="Github handle" className="fullwidth icon github" disabled={!editing} />
              <ErrorMessage form="account-settings" field="github_handle" />

              <Field name="twitter_handle" component="input" type="text" placeholder="Twitter handle" className="fullwidth icon twitter" disabled={!editing} />
              <ErrorMessage form="account-settings" field="twitter_handle" />

              <Field name="linkedin_url" component="input" type="text" placeholder="Linkedin URL" className="fullwidth icon linkedin" disabled={!editing} />
              <ErrorMessage form="account-settings" field="linkedin_url" />
            </div>

            {/* Employment and Education */}
            <div className="form-row">
              <label htmlFor="college">Employment and Education</label>
              <Field id="college" name="college" component="input" type="text" placeholder="College" className="fullwidth" disabled={!editing} />
              <ErrorMessage form="account-settings" field="college" />

              <Field name="employment_status" component="select" className="fullwidth" disabled={!editing}>
                <option value="" disabled>Employment Status</option>
                {map(EMPLOYMENT_STATUS, (label, status) =>
                  <option key={status} value={status}>{label}</option>
                )}
              </Field>
              <ErrorMessage form="account-settings" field="employment_status" />

              <Field name="company" component="input" type="text" placeholder="Company" className="fullwidth" disabled={!editing} />
              <ErrorMessage form="account-settings" field="company" />
            </div>

            {editing &&
              <Button
                {...buttonPropsFromReduxForm(this.props)}
                type="submit"
                primary
                form
                centered
                fullwidth
                buttonRef={ref => this.submitButton = ref}
              >
                Update
              </Button>
            }
          </form>
        
        }

        {!editing &&
          <div>
            <label>Name</label>
            <p>{currentUser.first_name} {currentUser.last_name}</p>

            <label>Email</label>
            <p>{currentUser.email}</p>

            {currentUser.tshirt_size &&
              <Fragment>
                <label>T-shirt size</label>
                <p>{currentUser.tshirt_size}</p>
              </Fragment>
            }

            {currentUser.birthday &&
              <Fragment>
                <label>Birthday</label>
                <p>{currentUser.birthday}</p>
              </Fragment>
            }

            {currentUser.birthday &&
              <Fragment>
                <label>Bio</label>
                <p>{currentUser.bio}</p>
              </Fragment>
            }

            {(currentUser.github_handle || currentUser.twitter_handle || currentUser.linkedin_url) &&
              <Fragment>
                <label>Social Media</label>
                <p>{currentUser.github_handle}</p>
                <p>{currentUser.twitter_handle}</p>
                <p>{currentUser.linkedin_url}</p>
              </Fragment>
            }

            {(currentUser.college || currentUser.employment_status || currentUser.company) &&
              <Fragment>
                <label>Employment and Education</label>
                <p>{currentUser.college}</p>
                <p>{currentUser.employment_status}</p>
                <p>{currentUser.company}</p>
              </Fragment>
            }
          </div>
        }

      </div>
    );
  }

}

export default compose(
  setDisplayName("AccountSettings"),

  connect(({ currentUser }) => ({
    currentUser,
    initialValues: {
      ...currentUser,
      name: `${currentUser.first_name} ${currentUser.last_name}`,
    },
  })),

  reduxForm({
    form: "account-settings",
    validate,
  }),
)(AccountSettings);
