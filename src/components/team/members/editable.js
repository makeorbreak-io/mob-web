import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { isEmpty, map, filter, includes } from "lodash";

//
// Components
import {
  Button,
  ErrorMessage,
} from "uikit";
import { Multiselect } from "components/fields";

//
// Util
import { displayName } from "util/user";

//
// Redux
import { fetchUsers } from "actions/users";
import { inviteUserToTeam, revokeInvite } from "actions/members";

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
      map(values.members, ({ value: id }) => dispatch(inviteUserToTeam(id)))
    );
  }

  revokeInvite = (id) => {
    const { dispatch, team } = this.props;

    return dispatch(revokeInvite(id, team.id));
  }

  updateMultipleSelected = (ev) => {
    this.setState({ multipleSelected: !isEmpty(ev[1]) });
  }

  //---------------------------------------------------------------------------
  // Render
  //---------------------------------------------------------------------------
  render() {
    const { team: { members, invites }, users, handleSubmit, submitting, valid } = this.props;
    const { multipleSelected } = this.state;

    return (
      <div className="TeamMembers editable">
        {!isEmpty(members) && <label>Members</label>}
        <ul className="Members">
          {map(members, i => (
            <li className="Member" key={i.id}>
              {displayName(i)}
            </li>
          ))}
        </ul>

        {!isEmpty(invites) && <label>Pending Invites</label>}
        <ul className="Invites">
          {map(invites, i => (
            <li className="Invite" key={i.id}>
              {displayName(i.invitee)}
              <Button fakelink onClick={() => this.revokeInvite(i.id)}>revoke invitation</Button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit(this.inviteMembers)}>
          <label htmlFor="members">Invite Members</label>
          <Field id="members" name="members" component={Multiselect} options={users} placeholder="Search users..." onChange={this.updateMultipleSelected} />
          <ErrorMessage form="members" field="email" />

          <Button type="submit" form centered fullwidth primary disabled={submitting || !valid} loading={submitting}>
            Invite {multipleSelected ? "members" : "member"}
          </Button>
        </form>
      </div>
    );
  }
}

export default compose(
  setDisplayName("EditableTeamMembers"),

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
      label: displayName(u),
    });

    return {
      users: filter(map(users, toOption), o => !includes(invalidUserIds, o.value)),
    };
  }),

  reduxForm({
    form: "new-team-member",
    validate,
  }),
)(EditableTeamMembers);
