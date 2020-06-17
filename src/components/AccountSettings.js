import React from "react";
import { useHistory } from "react-router-dom";
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
import { handleGraphQLErrors } from "lib/graphql";

//
// Constants
import { TSHIRT_SIZES } from "constants/user";

//
// Validation
import { validatePresence, validateEmail } from "validators";

export const AccountSettings = () => {
  const history = useHistory();
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
      .then(() => history.push("/dashboard"))
      .catch(handleGraphQLErrors)
  );

  return (
    <Section center>
      <Heading size="xl" color="green" centered>Your Account</Heading>

      <Form
        onSubmit={submit}
        submitLabel="Update profile"
        initialValues={initialValues}
      >
        <Field
          label="Name"
          name="name"
          placeholder="Name"
          type="text"
          validate={validatePresence}
        />

        <Field
          label="Email"
          name="email"
          placeholder="Email"
          type="email"
          validate={validateEmail}
        />

        <Field
          label="T-Shirt size"
          name="tshirtSize"
          component="select"
          validate={validatePresence}
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
