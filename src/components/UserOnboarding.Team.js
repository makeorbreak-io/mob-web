import React, { Component } from "react";
import { compose, setDisplayName, mapProps } from "recompose";
import { withRouter } from "react-router";
import { reduxForm, Field } from "redux-form";
import { get, isEmpty } from "lodash";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { withCurrentUser, waitForData, multistep } from "enhancers";

import { fullTeam, fullUser } from "fragments";

//
// Components
import {
  Button,
  ErrorMessage,
} from "components/uikit";
import Invites from "components/UserOnboarding.Invites";

//
// Validation
import { composeValidators, validatePresence } from "validators";

const validate = composeValidators(
  validatePresence("githubHandle", "GitHub handle"),
  validatePresence("name", "Team name"),
);

export class UserOnboardingTeam extends Component {
  onSubmit = ({ githubHandle, ...team }) => {
    const { createTeam, updateMe, data } = this.props;
    const { name, email, tshirtSize } = data.me;

    return updateMe({ variables: { user: { name, email, tshirtSize, githubHandle } } })
    .then(() => createTeam({ variables: { team } }))
    .then(() => data.refetch());
  }

  render() {
    const { data: { me }, handleSubmit, submitting, next } = this.props;

    return (
      <div className="UserOnboarding team">
        <h1>Nice to meet you, {me.displayName}</h1>
        <h5>Set up the team you'll be working in at the Make or Break hackathon.</h5>

        <form onSubmit={handleSubmit(this.onSubmit)}>
          <label htmlFor="githubHandle">GitHub Handle</label>
          <Field
            id="githubHandle"
            name="githubHandle"
            component="input"
            type="text"
            placeholder="Your GitHub handle"
            className="fullwidth"
          >
          </Field>

          <label htmlFor="name">Team name</label>
          <Field
            id="name"
            name="name"
            component="input"
            type="text"
            placeholder="Type your team name"
            className="fullwidth"
            autoComplete="off"
            disabled={!isEmpty(me.currentTeam)}
          />
          <ErrorMessage form="user-onboarding-team" field="name" />

          {isEmpty(me.currentTeam) &&
            <div>
              <Button
                type="submit"
                disabled={submitting}
                loading={submitting}
                primary form centered fullwidth
              >
                Create Team
              </Button>

              <Button form centered fullwidth primary hollow onClick={next}>
                Skip this step
              </Button>
              <p className="small-notice">You can always create a team or wait for an invitation to one at a later time</p>
            </div>
          }
        </form>

        {!isEmpty(me.currentTeam) && <Invites />}
      </div>
    );
  }
}

export default compose(
  setDisplayName("UserOnboardingTeam"),

  withRouter,

  withCurrentUser,
  waitForData,

  multistep({
    name: "user-onboarding",
  }),

  mapProps(props => ({
    ...props,
    initialValues: {
      githubHandle: props.data.me.githubHandle,
      name: get(props, "data.me.currentTeam.name"),
    },
  })),

  reduxForm({
    form: "user-onboarding-team",
    validate,
  }),

  graphql(
    gql`mutation createTeam($team: TeamInput!) {
      createTeam(team: $team) { ...fullTeam }
    } ${fullTeam}`,
    { name: "createTeam" },
  ),

  graphql(
    gql`mutation updateMe($user: UserInput!) {
      updateMe(user: $user) { ...fullUser }
    } ${fullUser}`,
    { name: "updateMe" },
  ),
)(UserOnboardingTeam);

