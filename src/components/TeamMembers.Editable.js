import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Field, reduxForm, getFormValues } from "redux-form";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import classnames from "classnames";

//
// Enhancers
import { withCurrentUser, waitForData } from "enhancers";

import { fullTeam } from "fragments";

import { handleGraphQLErrors } from "lib/graphql";

//
// Components
import {
  Button,
  buttonPropsFromReduxForm,
  ErrorMessage,
  Avatar,
} from "components/uikit";
import { Multiselect } from "components/fields";

//
// Constants
import { EMAIL_REGEX } from "constants/validators";

//
// Validation
import { composeValidators, validatePresence } from "validators";

const validate = (values) => {
  return composeValidators(
    validatePresence("members", "Members"),
  )(values);
};

export class EditableTeamMembers extends Component {

  state = {
    multipleSelected: false,
  }

  //---------------------------------------------------------------------------
  // Callbacks
  //---------------------------------------------------------------------------
  inviteMembers = (values) => {
    const { dispatch, reset, team, invite } = this.props;

    dispatch(reset());

    return invite({
      variables: { id: team.id, emails: values.members.map(m => m.value) },
    })
    .catch(handleGraphQLErrors);
  }

  revokeInvite = (id) => {
    return this.props.revokeInvite({
      variables: { id },
    })
    .catch(handleGraphQLErrors);
  }

  removeFromTeam = (userId) => {
    const { removeFromTeam, team: { id }, data } = this.props;

    return removeFromTeam({
      variables: { userId, id },
    })
    .then(() => data.refetch())
    .catch(handleGraphQLErrors);
  }

  updateMultipleSelected = (ev) => {
    this.setState({ multipleSelected: !isEmpty(ev[1]) });
  }

  //---------------------------------------------------------------------------
  // Render
  //---------------------------------------------------------------------------
  render() {
    const { data: { me }, team, handleSubmit, submitting, valid, formValues, editing } = this.props;
    const { multipleSelected } = this.state;

    const memberLimitReached = (team.invites.length + team.memberships.length) >= 4;
    const canInvite = formValues.members.length + team.memberships.length + team.invites.length <= 4;

    const inviteCx = classnames({ hidden: !editing });

    return (
      <div className="TeamMembers editable">
        {!isEmpty(team.memberships) && <label>Members</label>}
        <ul className="Members">
          {team.memberships.map(({ user }) => (
            <li className="Member" key={user.id}>
              <Avatar user={user} />
              {user.displayName}
              {!team.applied && editing &&
                <Button
                  danger
                  small
                  onClick={() => this.removeFromTeam(user.id)}
                  confirmation={team.memberships.length === 1 ? "You are about the delete the last member of the team. If you do so, the team will be deleted." : null}
                >
                  {user.id === me.id ? "leave" : "remove"}
                </Button>
              }
            </li>
          ))}
        </ul>

        {!isEmpty(team.invites) && <label>Pending Invites</label>}
        <ul className="Invites">
          {team.invites.map(invite => (
            <li className="Invite" key={invite.id}>
              <Avatar user={invite} />
              {invite.displayName}
              <Button
                danger
                small
                onClick={() => this.revokeInvite(invite.id)}
              >
                cancel
              </Button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit(this.inviteMembers)} className={inviteCx}>
          <label htmlFor="members">Invite Members</label>
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
            primary
            disabled={submitting || !valid || memberLimitReached || !canInvite}
            feedbackSuccessLabel="Members invited!"
            feedbackFailureLabel="Error inviting members"
          >
            Invite {multipleSelected ? "members" : "member"}
          </Button>

          <ErrorMessage form="members" field="email" />


          {(memberLimitReached || !canInvite) &&
            <p className="small-notice">
              Teams can only have a maximum of 4 members.<br />
              Please remove some members or revoke invites to invite other people.
            </p>
          }

          {!valid && !memberLimitReached && !submitting &&
            <p className="small-notice">
              Please select at least one user before inviting.
            </p>
          }
        </form>
      </div>
    );
  }
}

export default compose(
  setDisplayName("EditableTeamMembers"),

  withCurrentUser,
  waitForData,

  reduxForm({
    form: "new-team-member",
    validate,
  }),

  connect(state => ({
    formValues: getFormValues("new-team-member")(state) || { members: [] },
  })),

  graphql(
    gql`mutation invite($id: String!, $emails: [String]!) {
      invite(id: $id, emails: $emails) { ...fullTeam }
    } ${fullTeam}`,
    { name: "invite" },
  ),

  graphql(
    gql`mutation revokeInvite($id: String!) {
      revokeInvite(id: $id) { ...fullTeam }
    } ${fullTeam}`,
    { name: "revokeInvite" },
  ),

  graphql(
    gql`mutation removeFromTeam($id: String!, $userId: String!) {
     removeFromTeam(id: $id, userId: $userId) { ...fullTeam }
    } ${fullTeam}`,
    { name: "removeFromTeam" },
  ),
)(EditableTeamMembers);
