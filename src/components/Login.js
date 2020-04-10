import React from "react";
import { compose } from "recompose";
import { useHistory } from "react-router-dom";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { withCurrentUser } from "enhancers";

import { handleGraphQLErrors } from "lib/graphql";

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
// Validation
import { composeValidators, validatePresence, validateEmail } from "validators";

const validate = (values) => {
  return composeValidators(
    validateEmail("email", "Email"),
    validatePresence("password", "Password"),
  )(values);
};

export const Login = ({
  authenticate,
  data,
}) => {
  const history = useHistory();

  const submit = ({ email, password }) => {
    return authenticate({ variables: { email: email.trim().toLowerCase(), password } })
      .then((response) => localStorage.setItem("jwt", response.data.authenticate))
      .then(() => data.refetch())
      .then(() => {
        history.push("/dashboard");
        return null;
      })
      .catch(handleGraphQLErrors);
  };

  return (
    <Section background="white" center>
      <Heading size="xl" color="purple" centered>
        Sign In
      </Heading>

      <Form onSubmit={submit} validate={validate} submitLabel="Sign In">
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
      </Form>

      <P additional>
        Don't have an account? <Link to="/signup">Sign up</Link>
        <br />
        Forgot your password? <Link to="/recover-password">Recover it</Link>
      </P>
    </Section>
  );
};

export default compose(
  withCurrentUser,

  graphql(
    gql`mutation authenticate($email: String!, $password: String!) {
      authenticate(email: $email, password: $password)
    }`,
    { name: "authenticate" },
  ),
)(Login);
