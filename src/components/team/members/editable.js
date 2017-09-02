import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { isEmpty, map, filter, includes, get } from "lodash";

//
// Components
import {
  Button,
  ErrorMessage,
  Avatar,
} from "uikit";
import { Multiselect } from "components/fields";

//
// Redux
import { fetchUsers } from "actions/users";
import { inviteUserToTeam, inviteUserByEmail, revokeInvite, removeFromTeam } from "actions/members";
import { refreshCurrentUser } from "actions/current_user";

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
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(fetchUsers());
  }

  //---------------------------------------------------------------------------
  // Callbacks
  //---------------------------------------------------------------------------
  inviteMembers = (values) => {
    const { dispatch, reset } = this.props;

    dispatch(reset());

    return Promise.all(
      map(values.members, ({ label, value }) => {
        return label === value
          ? dispatch(inviteUserByEmail(value))
          : dispatch(inviteUserToTeam(value));
      })
    ).finally(() => dispatch(refreshCurrentUser()));
  }

  revokeInvite = (id) => {
    const { dispatch, team } = this.props;

    return dispatch(revokeInvite(id, team.id));
  }

  removeFromTeam = (id) => {
    const { dispatch, team } = this.props;

    return dispatch(removeFromTeam(id, team.id));
  }

  updateMultipleSelected = (ev) => {
    this.setState({ multipleSelected: !isEmpty(ev[1]) });
  }

  //---------------------------------------------------------------------------
  // Render
  //---------------------------------------------------------------------------
  render() {
    const { team, users, currentUser, memberLimitReached, handleSubmit, submitting, valid, formValues } = this.props;
    const { multipleSelected } = this.state;

    const canInvite = !memberLimitReached && (formValues.members.length + team.members.length + team.invites.length <= 4);

    return (
      <div className="TeamMembers editable">
        {!isEmpty(team.members) && <label>Members</label>}
        <ul className="Members">
          {map(team.members, m => (
            <li className="Member" key={m.id}>
              <Avatar user={m} />
              {m.display_name}
              {!team.applied &&
                <Button
                  danger
                  small
                  onClick={() => this.removeFromTeam(m.id)}
                  confirmation={team.members.length === 1 ? "You are about the delete the last member of the team. If you do so, the team will be deleted." : null}
                >
                  {m.id === currentUser.id ? "leave" : "remove"}
                </Button>
              }
            </li>
          ))}
        </ul>

        {!isEmpty(team.invites) && <label>Pending Invites</label>}
        <ul className="Invites">
          {map(team.invites, i => (
            <li className="Invite" key={i.id}>
              <Avatar user={{}} />
              {get(i, "invitee.display_name", i.email)}
              <Button
                danger
                small
                onClick={() => this.revokeInvite(i.id)}
              >
                cancel
              </Button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit(this.inviteMembers)}>
          <label htmlFor="members">Invite Members</label>
          <Field
            id="members"
            name="members"
            component={Multiselect}
            options={users}
            placeholder="Search users or use an email..."
            onChange={this.updateMultipleSelected}
            isValidNewOption={({ label }) => EMAIL_REGEX.test(label)}
            creatable
          />
          <ErrorMessage form="members" field="email" />

          <Button
            type="submit"
            form
            centered
            fullwidth
            primary
            disabled={submitting || !valid || memberLimitReached || !canInvite}
            loading={submitting}
          >
            Invite {multipleSelected ? "members" : "member"}
          </Button>

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

  reduxForm({
    form: "new-team-member",
    validate,
  }),

  // fetch list of all users from store, remove current user
  // and team invites and members from suggestions
  connect((state, props) => {
    const { users, currentUser } = state;
    const { team } = props;

    const invalidUserIds = [
      currentUser.id,
      ...map(team.invites, "invitee.id"),
    ];

    const toOption = (u) => ({
      value: u.id,
      label: u.display_name,
    });

    const memberLimitReached = (team.invites.length + team.members.length) >= 4;

    return {
      users: filter(map(users, toOption), o => !includes(invalidUserIds, o.value)),
      memberLimitReached,
      currentUser,
      formValues: state.form["new-team-member"].values || { members: [] },
    };
  }),
)(EditableTeamMembers);
