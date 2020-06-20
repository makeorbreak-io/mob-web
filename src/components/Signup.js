import React from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";

import { REGISTER } from "mutations";
import { useCurrentUser } from "hooks";

//
// Components
import {
  Field,
  Form,
  Heading,
  Link,
  Section,
  P,
} from "components/2020/uikit";

//
// lib
import { handleGraphQLErrors } from "lib/graphql";

//
// Validation
import {
  validateEmail,
  validatePresence,
  validateMatch,
  validateChecked,
} from "validators";

export const Signup = () => {
  const history = useHistory();
  const { refetch } = useCurrentUser();
  const [register] = useMutation(REGISTER);

  const submit = ({ email, password }, actions) => (
    register({ variables: { email: email.trim().toLowerCase(), password } })
      .then((response) => localStorage.setItem("jwt", response.data.register))
      .then(() => refetch())
      .then(() => {
        history.push("/welcome");
        return null;
      })
      .catch(handleGraphQLErrors(actions))
  );

  return (
    <Section background="white" center>
      <Heading size="xl" color="purple" centered>
        Sign Up
      </Heading>

      <Form
        onSubmit={submit}
        submitLabel="Sign Up"
        initialValues={{ email: "", password: "", password_confirmation: "" }}
      >
        {({ values }) => (
          <>
            <Field
              label="Email"
              name="email"
              placeholder="Email"
              type="email"
              tabIndex="0"
              validate={validateEmail}
            />

            <Field
              label="Password"
              name="password"
              placeholder="Password"
              type="password"
              tabIndex="0"
              validate={validatePresence}
            />

            <Field
              label="Password confirmation"
              name="password_confirmation"
              placeholder="Password confirmation"
              type="password"
              tabIndex="0"
              validate={validateMatch(values.password, "password")}
            />

            <Field
              label={<>I have read and accepted the general <Link tabIndex="-1" external to="https://makeorbreak.io/terms-of-service/">Terms of Use</Link></>}
              type="checkbox"
              name="tos"
              tabIndex="0"
              validate={validateChecked}
            />
          </>
        )}
      </Form>

      <P additional>
        Already have an account? <Link to="/signin">Sign in</Link>
      </P>
    </Section>
  );
};

export default Signup;
