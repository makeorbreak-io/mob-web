import React from "react";
import { compose, setDisplayName, mapProps } from "recompose";
import { reduxForm, Field } from "redux-form";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { withCurrentUser, waitForData } from "enhancers";

import { fullUser } from "fragments";

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
  validatePresence("first_name", "First name"),
  validatePresence("last_name", "Last name"),
  validatePresence("tshirt_size", "T-Shirt size"),
);

//
// constants
import { TSHIRT_SIZES } from "constants/user";

export const UserOnboardingName = ({
  updateMe,
  handleSubmit,
  submitting,
  next,
}) => {
  const submitHandler = (user) => updateMe({ variables: { user } }).then(next);

  return (
    <div className="UserOnboarding name">
      <h1>Welcome to Make or Break</h1>
      <h5>You'll be setting your hackathon project soon. We just need some basic information to get started.</h5>

      <form onSubmit={handleSubmit(submitHandler)}>
        <label htmlFor="name">Name</label>
        <Field id="name" name="name" component="input" type="text" placeholder="Type your name" className="fullwidth" />

        <label htmlFor="tshirtSize">T-Shirt Size</label>
        <Field id="tshirtSize" name="tshirtSize" component="select" className="fullwidth">
          <option value="" disabled>Choose your t-shirt size</option>
          {TSHIRT_SIZES.map(size =>
            <option key={size} value={size}>{size}</option>
          )}
        </Field>
        <ErrorMessage form="user-onboarding-name" field="tshirtSize" />

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

  withCurrentUser,

  waitForData,

  mapProps(props => {
    const { data: { me: { name, email, tshirtSize } } } = props;

    return {
      ...props,
      initialValues: { name, email, tshirtSize },
    };
  }),

  reduxForm({
    form: "user-onboarding-name",
    validate,
  }),

  graphql(
    gql`mutation updateMe($user: UserInput!) {
      updateMe(user: $user) { ...fullUser }
    } ${fullUser}`,
    { name: "updateMe" },
  ),
)(UserOnboardingName);
