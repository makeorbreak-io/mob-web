import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, withState, getContext } from "recompose";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { get, isEmpty, includes } from "lodash";
import { flow, map, filter } from "lodash/fp";

//
// Components
import {
  Button,
  ErrorMessage,
} from "components/uikit";
import { Multiselect } from "components/fields";

//
// Redux
import { inviteUserToTeam } from "actions/members";

//
// Validation
import { composeValidators, validatePresence } from "validators";

const validate = (values) => {
  return composeValidators(
    validatePresence("members", "Team members"),
  )(values);
};

export const UserOnboardingInvites = ({
  dispatch,
  currentUser,
  handleSubmit,
  submitting,
  valid,
  users,
  multipleSelected,
  setMultipleSelected,
  router,
}) => {
  const submitHandler = (values) => {
    return Promise.all(
      values.members.map(({ value: id }) => dispatch(inviteUserToTeam(id))),
    ).then(() => router.push("/dashboard"));
  };

  const changeHandler = (ev) => setMultipleSelected(!isEmpty(ev[1]));

  return (
    <div className="UserOnboarding invites">
      <h1>Get the ball rolling</h1>
      <h5>
        Start by adding all of your team members to your "{get(currentUser, "team.name")}" team.
        <br />
        They'll receive a notification the next time they log in to the platform.
      </h5>

      <form onSubmit={handleSubmit(submitHandler)}>
        <label htmlFor="members">Add team members</label>
        <Field name="members" component={Multiselect} options={users} placeholder="Search users..." onChange={changeHandler} />
        <ErrorMessage form="members" field="email" />

        <Button type="submit" form centered fullwidth primary disabled={submitting || !valid} loading={submitting}>
          Invite {multipleSelected ? "members" : "member"}
        </Button>
        <Button form centered fullwidth primary hollow onClick={() => router.push("/")}>
          Skip this step
        </Button>

        <p className="small-notice">You can always invite more members at a later time</p>
      </form>
      
    </div>
  );
};

export default compose(
  setDisplayName("UserOnboardingInvites"),

  // connect(({ currentUser, users }) => ({ currentUser, users })),
  connect((state) => {
    const { users, currentUser } = state;
    const team = state.teams[get(currentUser, "team.id")] || {};

    const invalidUserIds = [
      currentUser.id,
      ...map(team.invites, "invitee.id"),
    ];

    const toOption = (u) => ({
      value: u.id,
      label: u.display_name,
    });

    return {
      currentUser,
      users: flow(
        map(toOption),
        filter(o => !includes(invalidUserIds, o.value)),
      )(users),
    };
  }),

  reduxForm({
    form: "user-onboarding-invites",
    validate,
  }),

  withState("multipleSelected", "setMultipleSelected", false),

  getContext({
    router: PropTypes.object.isRequired,
  }),
)(UserOnboardingInvites);


