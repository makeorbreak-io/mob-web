import React, { Component } from "react";
import { compose, setDisplayName, mapProps } from "recompose";
import { Link, withRouter } from "react-router";
import { reduxForm, Field } from "redux-form";
import { get, isEmpty } from "lodash";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { withCurrentUser, waitForData } from "enhancers";

import { fullTeam } from "fragments";

//
// Components
import {
  Button,
  ErrorMessage,
} from "components/uikit";

//
// Validation
import { composeValidators, validatePresence } from "validators";

const validate = composeValidators(
  validatePresence("name", "Team name"),
);

export class UserOnboardingTeam extends Component {
  onSubmit = (team) => {
    const { createTeam, data, next } = this.props;

    return createTeam({ variables: { team } })
      .then(() => data.refetch())
      .then(next);
  }

  render() {
    const { data: { me }, handleSubmit, submitting, next } = this.props;

    return (
      <div className="UserOnboarding team">
        <h1>Nice to meet you, {me.displayName}</h1>
        <h5>Set up the team you'll be working in at the Make or Break hackathon.</h5>

        <form onSubmit={handleSubmit(this.onSubmit)}>
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

              <Link to="/dashboard">
                <Button form centered fullwidth primary hollow>
                  Skip this step
                </Button>
              </Link>
              <p className="small-notice">You can always create a team, or wait for an invitation to one at a later time</p>
            </div>
          }

          {!isEmpty(me.currentTeam) &&
            <Button primary form centered fullwidth onClick={next}>
              Continue
            </Button>
          }
        </form>
      </div>
    );
  }
}

export default compose(
  setDisplayName("UserOnboardingTeam"),

  withRouter,

  withCurrentUser,
  waitForData,

  mapProps(props => ({
    ...props,
    initialValues: { name: get(props, "data.me.currentTeam.name") },
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
)(UserOnboardingTeam);

