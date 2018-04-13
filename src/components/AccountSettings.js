import React, { Component, Fragment } from "react";
import { compose, mapProps, setDisplayName } from "recompose";
import { Field, reduxForm } from "redux-form";
import { map, omit } from "lodash";
import classnames from "classnames";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

//
// Enhancers
import { withCurrentUser, waitForData } from "enhancers";

import { fullUser } from "fragments";

//
// Components
import {
  Button,
  buttonPropsFromReduxForm,
  ErrorMessage,
} from "components/uikit";

//
// Constants
import { EMPLOYMENT_STATUS } from "constants/account_settings";
import { DATE_FORMAT } from "constants/date";
import { TSHIRT_SIZES } from "constants/user";

//
// Util
import { formatDate } from "lib/date";
import { handleGraphQLErrors } from "lib/graphql";

//
// Validation
import {
  composeValidators,
  validatePresence,
  validateEmail,
  validateDateFormat,
} from "validators";

const validate = composeValidators(
  validatePresence("name", "Name"),
  validateEmail("email", "Email"),
  validatePresence("tshirtSize", "T-Shirt size"),
  validateDateFormat("birthday", "Birthday", { format: DATE_FORMAT }),
);

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

  onSubmit = (user) => {
    return this.props.updateMe({
      variables: { user },
    })
    .then(() => this.setState({ editing: false }))
    .catch(handleGraphQLErrors);
  }

  render() {
    const { data: { me }, handleSubmit } = this.props;
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
              <label htmlFor="tshirtSize">T-Shirt Size</label>
              <Field id="tshirtSize" name="tshirtSize" component="select" className="fullwidth" disabled={!editing}>
                <option value="" disabled>Choose your t-shirt size</option>
                {TSHIRT_SIZES.map(size =>
                  <option key={size} value={size}>{size}</option>
                )}
              </Field>
              <ErrorMessage form="account-settings" field="tshirtSize" />
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
              <label htmlFor="githubHandle">Social Media</label>
              <Field id="githubHandle" name="githubHandle" component="input" type="text" placeholder="Github handle" className="fullwidth icon github" disabled={!editing} />
              <ErrorMessage form="account-settings" field="githubHandle" />

              <Field name="twitterHandle" component="input" type="text" placeholder="Twitter handle" className="fullwidth icon twitter" disabled={!editing} />
              <ErrorMessage form="account-settings" field="twitterHandle" />

              <Field name="linkedinUrl" component="input" type="text" placeholder="Linkedin URL" className="fullwidth icon linkedin" disabled={!editing} />
              <ErrorMessage form="account-settings" field="linkedinUrl" />
            </div>

            {/* Employment and Education */}
            <div className="form-row">
              <label htmlFor="college">Employment and Education</label>
              <Field id="college" name="college" component="input" type="text" placeholder="College" className="fullwidth" disabled={!editing} />
              <ErrorMessage form="account-settings" field="college" />

              <Field name="employmentStatus" component="select" className="fullwidth" disabled={!editing}>
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
            <p>{me.name}</p>

            <label>Email</label>
            <p>{me.email}</p>

            {me.tshirtSize &&
              <Fragment>
                <label>T-shirt size</label>
                <p>{me.tshirtSize}</p>
              </Fragment>
            }

            {me.birthday &&
              <Fragment>
                <label>Birthday</label>
                <p>{me.birthday}</p>
              </Fragment>
            }

            {me.bio &&
              <Fragment>
                <label>Bio</label>
                <p>{me.bio}</p>
              </Fragment>
            }

            {(me.githubHandle || me.twitterHandle || me.linkedinUrl) &&
              <Fragment>
                <label>Social</label>
                <p className="github">{me.githubHandle}</p>
                <p className="twitter">{me.twitterHandle}</p>
                <p className="linkedin">{me.linkedinUrl}</p>
              </Fragment>
            }

            {(me.college || me.employmentStatus || me.company) &&
              <Fragment>
                <label>Employment and Education</label>
                <p>{me.college}</p>
                <p>{me.employmentStatus}</p>
                <p>{me.company}</p>
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

  withCurrentUser,

  waitForData,

  mapProps(props => ({
    ...props,
    initialValues: omit(
      props.data.me,
      "__typename",
      "id",
      "invitations",
      "teams",
      "displayName",
      "gravatarHash",
      "currentAttendance",
      "currentBot",
      "currentTeam",
      "workshops",
      "favorites",
    ),
  })),

  reduxForm({
    form: "account-settings",
    validate,
  }),

  graphql(
    gql`mutation updateMe($user: UserInput!) {
      updateMe(user: $user) { ...fullUser }
    } ${fullUser}`,
    { name: "updateMe" },
  ),
)(AccountSettings);
