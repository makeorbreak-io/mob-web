import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { isEmpty, each, map, filter, includes } from "lodash";

//
// Components
import {
  Button,
  ErrorMessage,
} from "uikit";
import { Multiselect } from "components/fields";

//
// Redux
import { fetchUsers } from "actions/users";
import { inviteMember } from "actions/members";

//
// Validation
import { composeValidators, validatePresence } from "validators";

const validate = (values) => {
  return composeValidators(
    validatePresence("members", "Members"),
  )(values);
};

export class TeamMembers extends Component {

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
  inviteMember = (values) => {
    const { dispatch, reset } = this.props;

    each(values.members, ({ value: id }) => {
      dispatch(inviteMember(id));
    });
    dispatch(reset());
  }

  //---------------------------------------------------------------------------
  // Render
  //---------------------------------------------------------------------------
  render() {
    const { team, users, handleSubmit, submitting } = this.props;

    return (
      <div className="TeamMembers">
        {isEmpty(team.members) && isEmpty(team.invites) &&
          <p className="notice">No members, invite some!</p>
        }

        <ul>
          {map(team.invites, i => <li key={i.id}>{i.invitee.email}</li>)}
        </ul>

        <form onSubmit={handleSubmit(this.inviteMember)}>
          <Field name="members" component={Multiselect} options={users} placeholder="Search users..." />
          <ErrorMessage form="new-team-member" field="email" />

          <Button type="submit" form primary disabled={submitting} loading={submitting}>
            Invite member
          </Button>
        </form>
      </div>
    );
  }
}

export default compose(
  setDisplayName("TeamMembers"),

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
