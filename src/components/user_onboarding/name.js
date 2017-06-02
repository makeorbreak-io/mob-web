import React from "react";
import { compose, setDisplayName } from "recompose";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";

//
// Components
import {
  Button,
  ErrorMessage,
} from "uikit";

//
// Redux
import { updateCurrentUser } from "actions/current_user";

//
// Validation
import { composeValidators, validatePresence } from "validators";

const validate = (values) => {
  return composeValidators(
    validatePresence("first_name", "First name"),
    validatePresence("last_name", "Last name"),
  )(values);
};

export const UserOnboardingName = ({
  dispatch,
  currentUser: { id },
  handleSubmit,
  submitting,
  next,
}) => {
  const submitHandler = (values) => dispatch(updateCurrentUser(id, values)).then(next);

  return (
    <div className="UserOnboarding name">
      <h1>Welcome to Make or Break</h1>
      <h5>You'll be setting your hackathon project soon. We just need some basic information to get started.</h5>

      <form onSubmit={handleSubmit(submitHandler)}>
        <label htmlFor="first_name">First name</label>
        <Field id="first_name" name="first_name" component="input" type="text" placeholder="Type your first name" className="fullwidth" />
        <ErrorMessage form="user-onboarding-name" field="first_name" />

        <label htmlFor="last_name">Last name</label>
        <Field id="last_name" name="last_name" component="input" type="text" placeholder="Type your last name" className="fullwidth" />
        <ErrorMessage form="user-onboarding-name" field="last_name" />

        <Button
          type="submit"
          disabled={submitting}
          loading={submitting}
          primary hollow form centered fullwidth
        >
          Continue
        </Button>
      </form>
    </div>
  );
};

export default compose(
  setDisplayName("UserOnboardingName"),

  connect(({ currentUser }) => ({
    currentUser,
    initialValues: currentUser,
  })),

  reduxForm({
    form: "user-onboarding-name",
    validate,
  }),
)(UserOnboardingName);
