import React from "react";
import { compose } from "recompose";
import { useMutation } from "@apollo/react-hooks";

import { multistep } from "enhancers";

import { INVITE, REVOKE_INVITE } from "mutations";
import { useCurrentUser } from "hooks";
import { handleGraphQLErrors } from "lib/graphql";

//
// Components
import {
  Avatar,
  Button,
  Form,
  Field,
  Heading,
  P,
} from "components/2020/uikit";

//
// Validation
import { composeValidators, validateEmail } from "validators";

const validate = composeValidators(
  validateEmail("email", "Member email address"),
);

const UserOnboardingInvites = ({
  next,
}) => {
  const { data, refetch } = useCurrentUser();
  const [inviteMember] = useMutation(INVITE);
  const [revokeInvite] = useMutation(REVOKE_INVITE);

  const team = data.me.currentTeam;

  const submit = ({ email }) => (
    inviteMember({ variables: { teamId: team.id, emails: [email] } })
      .then(() => refetch())
      .catch(handleGraphQLErrors)
  );

  const revoke = (id) => (
    revokeInvite({ variables: { id } })
      .then(() => refetch())
      .catch(handleGraphQLErrors)
  );

  const limitReached = team.members.length + team.invites.length >= 4;

  return (
    <Form
      onSubmit={submit}
      validate={validate}
      withoutSubmitButton
    >
      <Heading size="l" centered>Team Members</Heading>

      <ul>
        {team.members.map((member) => (
          <li key={member.id}>
            <Avatar user={member} />
            <span>{member.displayName}</span>
          </li>
        ))}
      </ul>

      {team.invites.length > 0 &&
        <>
          <Heading size="l" centered>Pending Invites</Heading>

          <ul>
            {team.invites.map((invite) => (
              <li key={invite.id}>
                <Avatar user={invite} />
                <span>{invite.displayName}</span>
                <Button size="small" level="secondary" onClick={() => revoke(invite.id)}>Cancel Invite</Button>
              </li>
            ))}
          </ul>
        </>
      }

      <Field
        label="Member email address"
        name="email"
        placeholder="Member email address"
        type="email"
        disabled={limitReached}
      />

      {!limitReached &&
        <Button type="submit" size="large" level="primary">
          Invite
        </Button>
      }

      {limitReached &&
        <P additional>A team can only have 4 elements at most</P>
      }

      <Button size="large" level="secondary" onClick={next}>
        {limitReached ? "Next" : "Skip this step"}
      </Button>

      {!limitReached &&
        <P additional>You can always invite more members at a later time</P>
      }
    </Form>
  );
};

export default compose(
  multistep({
    name: "user-onboarding",
  }),
)(UserOnboardingInvites);
