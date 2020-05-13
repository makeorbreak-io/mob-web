import React from "react";
import { useMutation } from "@apollo/react-hooks";

import {
  Heading,
  Link,
  Field,
  Form,
  Section,
} from "components/2020/uikit";

import { UPDATE_ME } from "mutations";
import { useCurrentUser } from "hooks";

//
// Constants
import { TSHIRT_SIZES } from "constants/user";

//
// Util
import { handleGraphQLErrors } from "lib/graphql";

//
// Validation
import {
  composeValidators,
  validatePresence,
  validateEmail,
} from "validators";

const validate = composeValidators(
  validatePresence("name", "Name"),
  validateEmail("email", "Email"),
  validatePresence("tshirtSize", "T-Shirt size"),
);

export const AccountSettings = () => {
  const { loading, data, refetch } = useCurrentUser();
  const [updateMe] = useMutation(UPDATE_ME);

  if (loading) return null;

  const initialValues = {
    name: data.me.name,
    email: data.me.email,
    tshirtSize: data.me.tshirtSize,
    githubHandle: data.me.githubHandle,
  };

  const submit = (user) => (
    updateMe({ variables: { user } })
      .then(() => refetch())
      .catch(handleGraphQLErrors)
  );

  return (
    <Section center>
      <Heading size="xl" color="green" centered>Your Account</Heading>

      <Form
        onSubmit={submit}
        initialValues={initialValues}
        validate={validate}
      >
        <Field
          label="Name"
          name="name"
          placeholder="Name"
          type="text"
        />

        <Field
          label="Email"
          name="email"
          placeholder="Email"
          type="email"
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

        <Field
          label="GitHub username"
          name="githubHandle"
          placeholder="GitHub username"
          type="text"
        />
      </Form>

      <Link to="/dashboard">Back to dashboard</Link>

    </Section>
  );
};

export default AccountSettings;
