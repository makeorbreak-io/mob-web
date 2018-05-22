import React, { Component, Fragment } from "react";
import { compose, setDisplayName } from "recompose";
import { reduxForm, Field, getFormValues } from "redux-form";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { withCurrentUser, waitForData, multistep } from "enhancers";

import { fullTeam } from "fragments";

import { handleGraphQLErrors } from "lib/graphql";

//
// Components
import {
  Button,
  buttonPropsFromReduxForm,
} from "components/uikit";
import { Multiselect } from "components/fields";

//
// Constants
import { EMAIL_REGEX } from "constants/validators";

//
// Validation
import { composeValidators, validatePresence } from "validators";

const validate = composeValidators(
  validatePresence("members", "Team members"),
);

export class UserOnboardingInvites extends Component {
  state = {
    multipleSelected: false,
  }

  onSubmit = (values) => {
    const { invite, data: { me }, next } = this.props;

    return invite({
      variables: { id: me.currentTeam.id, emails: values.members.map(m => m.value) },
    })
    .then(next)
    .catch(handleGraphQLErrors);
  }

  updateMultipleSelected = (ev) => this.setState({ multipleSelected: !isEmpty(ev[1]) })

  render() {
    const { data: { me }, handleSubmit, submitting, valid, formValues, next } = this.props;
    const team = me.currentTeam;
    const { multipleSelected } = this.state;

    const memberLimitReached = team
      ? (team.invites.length + team.memberships.length + formValues.members.length) > 4
      : false;

    return (
      <Fragment>
        <h1>Get the ball rolling</h1>
        <h5>
          Start by adding all of your team members to your "{get(me, "currentTeam.name")}" team.
          <br />
          They'll receive a notification the next time they log in to the platform.
        </h5>

        <form onSubmit={handleSubmit(this.onSubmit)}>
          <label htmlFor="members">Add team members</label>
          <Field
            id="members"
            name="members"
            component={Multiselect}
            placeholder="Invite users by email..."
            onChange={this.updateMultipleSelected}
            isValidNewOption={({ label }) => EMAIL_REGEX.test(label)}
            noResultsText={null}
            arrowRenderer={() => {}}
            promptTextCreator={label => `Add ${label}`}
            options={[]}
            creatable
          />
          <Button
            {...buttonPropsFromReduxForm(this.props)}
            type="submit"
            form
            centered
            fullwidth
            primary
            disabled={submitting || !valid || memberLimitReached}
            feedbackSuccessLabel="Members invited!"
            feedbackFailureLabel="Error inviting members"
          >
            Invite {multipleSelected ? "members" : "member"}
          </Button>

          {!isEmpty(team.memberships) && <label>Members</label>}
          <ul className="Members">
            {team.memberships.map(({ user }) => (
              <li className="Member" key={user.id}>
                {user.displayName}
              </li>
            ))}
          </ul>

          {!isEmpty(team.invites) && <label>Pending Invites</label>}
          <ul className="Invites">
            {team.invites.map(invite => (
              <li className="Invite" key={invite.id}>
                {invite.displayName}
              </li>
            ))}
          </ul>

          <Button form centered fullwidth primary hollow onClick={next}>
            Skip this step
          </Button>

          <p className="small-notice">You can always invite more members at a later time</p>
        </form>
      </Fragment>
    );
  }
}

export default compose(
  setDisplayName("UserOnboardingInvites"),

  withRouter,

  withCurrentUser,
  waitForData,

  multistep({
    name: "user-onboarding",
  }),

  reduxForm({
    form: "user-onboarding-invites",
    validate,
  }),

  graphql(
    gql`mutation invite($id: String!, $emails: [String]!) {
      invite(id: $id, emails: $emails) { ...fullTeam }
    } ${fullTeam}`,
    { name: "invite" },
  ),

  connect(state => ({
    formValues: getFormValues("user-onboarding-invites")(state) || { members: [] },
  })),
)(UserOnboardingInvites);


