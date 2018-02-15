import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, getContext } from "recompose";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";

//
// Components
import {
  Button,
  ErrorMessage,
} from "components/uikit";

//
// Redux
import { createTeam } from "actions/teams";

//
// Validation
import { composeValidators, validatePresence } from "validators";

const validate = (values) => {
  return composeValidators(
    validatePresence("name", "Team name"),
  )(values);
};

export const UserOnboardingTeam = ({
  dispatch,
  currentUser,
  handleSubmit,
  submitting,
  next,
  router,
}) => {
  const submitHandler = (values) => dispatch(createTeam(values)).then(next);

  return (
    <div className="UserOnboarding team">
      <h1>Nice to meet you, {currentUser.display_name}</h1>
      <h5>Set up the team you'll be working in at the Make or Break hackathon.</h5>

      <form onSubmit={handleSubmit(submitHandler)}>
        <label htmlFor="name">Team name</label>
        <Field id="name" name="name" component="input" type="text" placeholder="Type your team name" className="fullwidth" autoComplete="off" />
        <ErrorMessage form="user-onboarding-team" field="name" />

        {isEmpty(currentUser.team) &&
          <div>
            <Button
              type="submit"
              disabled={submitting}
              loading={submitting}
              primary form centered fullwidth
            >
              Create Team
            </Button>

            <Button form centered fullwidth primary hollow onClick={() => router.push("/")}>
              Skip this step
            </Button>
            <p className="small-notice">You can always create a team, or wait for an invitation to one at a later time</p>
          </div>
        }

        {!isEmpty(currentUser.team) &&
          <Button primary form centered fullwidth onClick={next}>
            Continue
          </Button>
        }
      </form>
    </div>
  );
};

export default compose(
  setDisplayName("UserOnboardingTeam"),

  connect(({ currentUser }) => ({
    currentUser,
    initialValues: {
      name: get(currentUser, "team.name"),
    },
  })),

  reduxForm({
    form: "user-onboarding-team",
    validate,
  }),

  getContext({
    router: PropTypes.object.isRequired,
  }),
)(UserOnboardingTeam);

