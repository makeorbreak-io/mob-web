import React, { Component } from "react";
import { func } from "prop-types";
import { compose, setDisplayName, setPropTypes, mapProps } from "recompose";
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
  BinaryToggle,
} from "components/uikit";

//
// Validation
import { composeValidators, validatePresence } from "validators";

const validate = composeValidators(
  validatePresence("name", "Name"),
  validatePresence("tshirtSize", "T-Shirt size"),
);

//
// constants
import { TSHIRT_SIZES } from "constants/user";

export class UserOnboardingName extends Component {

  updateMe = (user) => {
    const { updateMe, next } = this.props;

    return updateMe({ variables: { user } }).then(next);
  }

  render() {
    const { handleSubmit, submitting, setHackathonParticipant, data: { me } } = this.props;

    return (
      <div className="UserOnboarding name">
        <h1>Welcome to Make or Break</h1>

        <form onSubmit={handleSubmit(this.updateMe)}>
          <label htmlFor="email">email</label>
          <Field id="email" name="email" component="input" type="text" placeholder="Type your email" className="fullwidth" disabled />

          <label htmlFor="name">Name</label>
          <Field id="name" name="name" component="input" type="text" placeholder="Type your name" className="fullwidth" />
          <ErrorMessage form="user-onboarding-name" field="name" />

          <label htmlFor="tshirtSize">T-Shirt Size</label>
          <Field id="tshirtSize" name="tshirtSize" component="select" className="fullwidth">
            <option value="" disabled>Choose your t-shirt size</option>
            {TSHIRT_SIZES.map(size =>
              <option key={size} value={size}>{size}</option>
            )}
          </Field>
          <ErrorMessage form="user-onboarding-name" field="tshirtSize" />

          <label className="hackathon-participant clearfix">
            <span>
              I am interested in participating in the Make or Break hackathon
            </span>
            <BinaryToggle
              options={[
                { label: "yes", value: true },
                { label: "no", value: false },
              ]}
              defaultSelected={me.currentTeam ? 0 : 1}
              onChange={setHackathonParticipant}
            />
          </label>

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
  }
}

export default compose(
  setDisplayName("UserOnboardingName"),

  setPropTypes({
    setHackathonParticipant: func.isRequired,
  }),

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
