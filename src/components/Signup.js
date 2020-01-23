import React from "react";
import { compose } from "recompose";
import { useHistory } from "react-router-dom";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

//
// Enhancers
import { withCurrentUser } from "enhancers";

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
  composeValidators,
  validateEmail,
  validatePresence,
  validateMatch,
  validateChecked,
} from "validators";

const validate = (values) => {
  return composeValidators(
    validateEmail("email", "Email"),
    validatePresence("password", "Password"),
    validateMatch("password_confirmation", "Password confirmation", { match: values.password }),
    validateChecked("tos", "Terms of Use"),
  )(values);
};

export const Signup = ({
  data,
  register,
}) => {
  const history = useHistory();

  const submit = ({ email, password }) => (
    register({ variables: { email: email.trim.toLowerCase(), password } })
      .then((response) => localStorage.setItem("jwt", response.data.register))
      .then(() => data.refetch())
      .then(() => history.push("/welcome"))
      .catch(handleGraphQLErrors)
  );

  return (
    <Section background="white" center>
      <Heading size="xl" color="purple" centered>
        Sign Up
      </Heading>

      <Form onSubmit={submit} validate={validate} submitLabel="Sign Up">
        <Field
          label="Email"
          name="email"
          placeholder="Email"
          type="email"
        />

        <Field
          label="Password"
          name="password"
          placeholder="Password"
          type="password"
        />

        <Field
          label="Password confirmation"
          name="password_confirmation"
          placeholder="Password confirmation"
          type="password"
        />

        <Field
          label={<>I have read and accepted the general <Link external to="https://makeorbreak.io/terms-of-service/">Terms of Use</Link></>}
          type="checkbox"
          name="tos"
        />
      </Form>

      <P additional>
        Already have an account? <Link to="/signin">Sign in</Link>
      </P>
    </Section>
  );
};

export default compose(
  withCurrentUser,

  graphql(
    gql`mutation register($email: String!, $password: String!) {
      register(email: $email, password: $password)
    }
    `,
    { name: "register" },
  ),
)(Signup);
