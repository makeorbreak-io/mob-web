import gql from "graphql-tag";

import {
  email,
  fullUser,
  fullTeam,
} from "fragments";

export const AUTHENTICATE = gql`
  mutation ($email: String!, $password: String!) {
    authenticate(email: $email, password: $password)
  }
`;

export const REGISTER = gql`
  mutation ($email: String!, $password: String!) {
    register(email: $email, password: $password)
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation {
    deleteAccount { id }
  }
`;

export const UPDATE_ME = gql`
  mutation ($user: UserInput!) {
    updateMe(user: $user) { ...fullUser }
  } ${fullUser}
`;

export const CREATE_TEAM = gql`
  mutation ($team: TeamInput!) {
    createTeam(team: $team) { ...fullTeam }
  } ${fullTeam}
`;

export const INVITE = gql`
  mutation ($teamId: String!, $emails: [String]!) {
    invite(id: $teamId, emails: $emails) { ...fullTeam }
  } ${fullTeam}
`;

export const REVOKE_INVITE = gql`
  mutation ($id: String!) {
    revokeInvite(id: $id) { ...fullTeam }
  } ${fullTeam}
`;

export const ADMIN_CREATE_EMAIL = gql`
  mutation ($email: EmailInput!) {
    createEmail(email: $email) { ...email }
  } ${email}
`;

export const ADMIN_UPDATE_EMAIL = gql`
  mutation ($id: String!, $email: EmailInput!) {
    updateEmail(id: $id, email: $email) { ...email }
  } ${email}
`;

export const ADMIN_DELETE_EMAIL = gql`
  mutation ($id: String!) {
    deleteEmail(id: $email) { id }
  } ${email}
`;
