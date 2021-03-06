import gql from "graphql-tag";

import {
  edition,
  email,
  event,
  fullUser,
  fullTeam,
  suffrage,
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

//-----------------------------------------------------------------------------

export const CREATE_TEAM = gql`
  mutation ($team: TeamInput!) {
    createTeam(team: $team) { ...fullTeam }
  } ${fullTeam}
`;

export const UPDATE_TEAM = gql`
  mutation ($id: String!, $team: TeamInput!) {
    updateTeam(id: $id, team: $team) { ...fullTeam }
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

//-----------------------------------------------------------------------------

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
    deleteEmail(id: $id) { id }
  } ${email}
`;

//-----------------------------------------------------------------------------

export const ADMIN_CREATE_EVENT = gql`
  mutation createEvent($event: EventInput!){
    createEvent(event: $event) { ...event }
  } ${event}`
;

export const ADMIN_UPDATE_EVENT = gql`
  mutation updateEvent($slug: String!, $event: EventInput!){
    updateEvent(slug: $slug, event: $event) { ...event }
  } ${event}`
;

export const ADMIN_DELETE_EVENT = gql`
  mutation deleteEvent($slug: String!) {
    deleteEvent(slug: $slug) { slug }
  }`
;

//-----------------------------------------------------------------------------


export const ADMIN_CREATE_EDITION = gql`
  mutation createEdition($edition: EditionInput!) {
    createEdition(edition: $edition) { ...edition }
  } ${edition}`
;

export const ADMIN_UPDATE_EDITION = gql`
  mutation updateEdition($id: String!, $edition: EditionInput!) {
    updateEdition(id: $id, edition: $edition) { ...edition }
  } ${edition}`
;

export const ADMIN_SET_DEFAULT_EDITION = gql`
  mutation setEditionAsDefault($id: String!) {
    setEditionAsDefault(id: $id) { ...edition }
  } ${edition}`
;

export const ADMIN_DELETE_EDITION = gql`
  mutation deleteEdition($id: String!) {
    deleteEdition(id: $id)
  }`
;

//-----------------------------------------------------------------------------

export const ADMIN_CREATE_SUFFRAGE = gql`
  mutation createSuffrage($suffrage: SuffrageInput!, $editionId: String!) {
    createSuffrage(suffrage: $suffrage, editionId: $editionId) { ... suffrage }
  } ${suffrage}
`;

export const ADMIN_UPDATE_SUFFRAGE = gql`
  mutation updateSuffrage($id: String!, $suffrage: SuffrageInput!) {
    updateSuffrage(id: $id, suffrage: $suffrage) { ... suffrage }
  } ${suffrage}
`;

export const ADMIN_DELETE_SUFFRAGE = gql`
  mutation deleteSuffrage($id: String!) {
    deleteSuffrage(id: $id) { ...suffrage }
  } ${suffrage}
`;

export const ADMIN_START_SUFFRAGE_VOTING = gql`
  mutation startSuffrageVoting($id: String!) {
    startSuffrageVoting(id: $id) { ...suffrage }
  } ${suffrage}
`;

export const ADMIN_END_SUFFRAGE_VOTING = gql`
  mutation endSuffrageVoting($id: String!) {
    endSuffrageVoting(id: $id) { ...suffrage }
  } ${suffrage}
`;

export const ADMIN_RESOLVE_SUFFRAGE = gql`
  mutation resolveSuffrage($id: String!) {
    resolveSuffrage(id: $id) { ...suffrage }
  } ${suffrage}
`;

//-----------------------------------------------------------------------------

