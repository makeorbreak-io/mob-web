import React from "react";
import { compose } from "recompose";
import { useMutation } from "@apollo/react-hooks";

import { multistep } from "enhancers";

import { CREATE_TEAM } from "mutations";
import { useCurrentUser } from "hooks";
import { handleGraphQLErrors } from "lib/graphql";

//
// Components
import {
  Button,
  Field,
  Form,
  Heading,
  P,
} from "components/2020/uikit";
import Invites from "components/UserOnboarding.Invites";

//
// Validation
import { composeValidators, validatePresence } from "validators";

const validate = composeValidators(
  validatePresence("name", "Team name"),
);

export const UserOnboardingTeam = ({
  next,
}) => {
  const { loading, data, refetch } = useCurrentUser();
  const [createTeam] = useMutation(CREATE_TEAM);

  const submit = (team) => {
    return createTeam({ variables: { team } })
      .then(() => refetch())
      .catch(handleGraphQLErrors);
  };

  const team = data.me.currentTeam;

  if (loading) return "Loading...";

  return (
    <div className="UserOnboarding team">
      <Heading size="l" centered>Your Team</Heading>

      <Form
        onSubmit={submit}
        validate={validate}
        initialValues={{ name: team?.name }}
        withoutSubmitButton
      >
        <Field
          label="Team Name"
          name="name"
          placeholder="Team Name"
          type="text"
        />

        <Button type="submit" size="large" level="primary">
          {team ? "Update Team" : "Create Team"}
        </Button>

        {!data.me.currentTeam &&
          <>
            <Button size="large" level="secondary" onClick={next}>
              Skip this step
            </Button>

            <P additional>You can always create a team or wait for an invitation to one at a later time</P>
          </>
        }
      </Form>


      {data.me.currentTeam && <Invites />}
    </div>
  );
};

export default compose(
  multistep({
    name: "user-onboarding",
  }),
)(UserOnboardingTeam);
