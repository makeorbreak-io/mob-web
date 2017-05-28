import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { isEmpty, each, map, filter, includes } from "lodash";
import Promise from "bluebird";

//
// Components
import {
  Button,
  ErrorMessage,
  FormSectionHeader,
} from "uikit";
import { Multiselect } from "components/fields";

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

export class TeamMembers extends Component {

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
    const { team, users, handleSubmit, submitting, valid } = this.props;
    const { multipleSelected } = this.state;

    return (
      <div className="TeamMembers editable">
        <FormSectionHeader>Members</FormSectionHeader>
        {isEmpty(team.members) && isEmpty(team.invites) &&
          <p className="notice">No members, invite some!</p>
        }

        {!isEmpty(team.invites) && <FormSectionHeader>Pending Invites</FormSectionHeader>}
        <ul className="Invites">
          {map(team.invites, i => (
            <li className="Invite" key={i.id}>
              {i.invitee.email}
              <Button onClick={() => this.revokeInvite(i.id)} fakelink>revoke invitation</Button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit(this.inviteMembers)}>
          <Field name="members" component={Multiselect} options={users} placeholder="Search users..." onChange={this.updateMultipleSelected} />
          <ErrorMessage form="members" field="email" />

          <Button type="submit" form primary disabled={submitting || !valid} loading={submitting}>
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
    const { invites, members } = props.team;

    const invalidUserIds = [];
    each(invites, i => invalidUserIds.push(i.invitee.id));
    each(members, m => invalidUserIds.push(m.id));

    const toOption = (u) => ({
      value: u.id,
      label: isEmpty(u.first_name) ? u.email : `${u.first_name} ${u.last_name}`,
    });

    const filtered = filter(map(users, toOption), (option) => {
      return (
        option.value !== currentUser.id &&
        !includes(invalidUserIds, option.value)
      );
    });

    return {
      users: filtered,
    };
  }),

  reduxForm({
    form: "new-team-member",
    validate,
  }),
)(TeamMembers);
