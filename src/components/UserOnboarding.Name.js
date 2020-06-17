import React from "react";
import { func } from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";
import { useMutation } from "@apollo/react-hooks";

import { UPDATE_ME } from "mutations";
import { useCurrentUser } from "hooks";
import { handleGraphQLErrors } from "lib/graphql";

import {
  Field,
  Form,
  Heading,
  BinaryToggle,
} from "components/2020/uikit";

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

export const UserOnboardingName = ({
  setHackathonParticipant,
  next,
}) => {
  const { loading, data, refetch } = useCurrentUser();

  if (loading) return null;

  const [updateMe] = useMutation(UPDATE_ME);

  const { email, name, tshirtSize } = data.me;
  const initialValues = { email, name, tshirtSize };

  const submit = (user) => (
    updateMe({ variables: { user } })
      .then(() => refetch())
      .then(next)
      .catch(handleGraphQLErrors)
  );

  return (
    <div className="UserOnboarding name">
      <Heading size="l" centered>Welcome to Make or Break</Heading>

      <Form
        onSubmit={submit}
        submitLabel="Continue"
        validate={validate}
        initialValues={initialValues}
      >
        <Field
          label="Email"
          name="email"
          placeholder="Email"
          type="email"
        />

        <Field
          label="Name"
          name="name"
          placeholder="Name"
          type="text"
        />

        <Field
          label="T-Shirt size"
          name="tshirtSize"
          component="select"
        >
          <option value="" disabled>Select a size</option>
          {TSHIRT_SIZES.map(size =>
            <option key={size} value={size}>{size}</option>
          )}
        </Field>

        <div className="form__field">
          I am interested in participating in the Make or Break hackathon

          <BinaryToggle
            options={[
              { label: "no", value: false },
              { label: "yes", value: true },
            ]}
            defaultSelected={data.me.currentTeam ? 1 : 0}
            onChange={setHackathonParticipant}
          />
        </div>

      </Form>
    </div>
  );
};

export default compose(
  setDisplayName("UserOnboardingName"),

  setPropTypes({
    setHackathonParticipant: func.isRequired,
  }),
)(UserOnboardingName);
