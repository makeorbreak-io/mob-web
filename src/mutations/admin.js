import gql from "graphql-tag";

import {
  edition,
  email,
  event,
  fullTeam,
  fullUser,
  suffrage,
} from "fragments";

//-----------------------------------------------------------------------------

export const MAKE_ADMIN = gql`
  mutation makeAdmin($id: String!) {
    makeAdmin(id: $id) { ...fullUser }
  } ${fullUser}
`;

export const MAKE_PARTICIPANT = gql`
  mutation makeParticipant($id: String!) {
    makeParticipant(id: $id) { ...fullUser }
  } ${fullUser}
`;

export const REMOVE_USER = gql`
  mutation removeUser($id: String!) {
    removeUser(id: $id)
  }
`;

//-----------------------------------------------------------------------------

export const CREATE_EMAIL = gql`
  mutation ($email: EmailInput!) {
    createEmail(email: $email) { ...email }
  } ${email}
`;

export const UPDATE_EMAIL = gql`
  mutation ($id: String!, $email: EmailInput!) {
    updateEmail(id: $id, email: $email) { ...email }
  } ${email}
`;

export const DELETE_EMAIL = gql`
  mutation ($id: String!) {
    deleteEmail(id: $id) { id }
  } ${email}
`;

export const SEND_EMAIL = gql`
  mutation sendEmail($id: String!, $recipients: [String]!) {
    sendEmail(id: $id, recipients: $recipients)
  }
`;

//-----------------------------------------------------------------------------

export const CREATE_EVENT = gql`
  mutation createEvent($event: EventInput!){
    createEvent(event: $event) { ...event }
  } ${event}`
;

export const UPDATE_EVENT = gql`
  mutation updateEvent($slug: String!, $event: EventInput!){
    updateEvent(slug: $slug, event: $event) { ...event }
  } ${event}`
;

export const DELETE_EVENT = gql`
  mutation deleteEvent($slug: String!) {
    deleteEvent(slug: $slug) { slug }
  }`
;

//-----------------------------------------------------------------------------


export const CREATE_EDITION = gql`
  mutation createEdition($edition: EditionInput!) {
    createEdition(edition: $edition) { ...edition }
  } ${edition}`
;

export const UPDATE_EDITION = gql`
  mutation updateEdition($id: String!, $edition: EditionInput!) {
    updateEdition(id: $id, edition: $edition) { ...edition }
  } ${edition}`
;

export const SET_DEFAULT_EDITION = gql`
  mutation setEditionAsDefault($id: String!) {
    setEditionAsDefault(id: $id) { ...edition }
  } ${edition}`
;

export const DELETE_EDITION = gql`
  mutation deleteEdition($id: String!) {
    deleteEdition(id: $id)
  }`
;

//-----------------------------------------------------------------------------

export const APPLY_TEAM_TO_HACKATHON = gql`
  mutation applyTeamToHackathon($id: String!) {
    applyTeamToHackathon(id: $id) { ...fullTeam }
  } ${fullTeam}
`;

export const DEAPPLY_TEAM_FROM_HACKATHON = gql`
  mutation deapplyTeamFromHackathon($id: String!) {
    deapplyTeamFromHackathon(id: $id) { ...fullTeam }
  } ${fullTeam}
`;

export const ACCEPT_TEAM = gql`
  mutation acceptTeam($id: String!) {
    acceptTeam(id: $id) { ...fullTeam }
  } ${fullTeam}
`;

export const MAKE_TEAM_ELIGIBLE = gql`
  mutation makeTeamEligible($id: String!) {
    makeTeamEligible(id: $id) { ...fullTeam }
  } ${fullTeam}
`;

export const CREATE_TEAM_REPO = gql`
  mutation createTeamRepo($id: String!) {
    createTeamRepo(id: $id) { ...fullTeam }
  } ${fullTeam}
`;

export const DISQUALIFY_TEAM = gql`
  mutation disqualifyTeam($id: String!) {
    disqualifyTeam(id: $id) { ...fullTeam }
  } ${fullTeam}
`;

export const DELETE_ANY_TEAM = gql`
  mutation deleteAnyTeam($id: String!) {
    deleteAnyTeam(id: $id)
  }
`;

export const REMOVE_ANY_MEMBERSHIP = gql`
  mutation removeAnyMembership($teamId: String!, $userId: String!) {
    removeAnyMembership(teamId: $teamId, userId: $userId) { ...fullTeam }
  } ${fullTeam}
`;

//-----------------------------------------------------------------------------

export const CREATE_SUFFRAGE = gql`
  mutation createSuffrage($suffrage: SuffrageInput!, $editionId: String!) {
    createSuffrage(suffrage: $suffrage, editionId: $editionId) { ... suffrage }
  } ${suffrage}
`;

export const UPDATE_SUFFRAGE = gql`
  mutation updateSuffrage($id: String!, $suffrage: SuffrageInput!) {
    updateSuffrage(id: $id, suffrage: $suffrage) { ... suffrage }
  } ${suffrage}
`;

export const DELETE_SUFFRAGE = gql`
  mutation deleteSuffrage($id: String!) {
    deleteSuffrage(id: $id) { ...suffrage }
  } ${suffrage}
`;

export const START_SUFFRAGE_VOTING = gql`
  mutation startSuffrageVoting($id: String!) {
    startSuffrageVoting(id: $id) { ...suffrage }
  } ${suffrage}
`;

export const END_SUFFRAGE_VOTING = gql`
  mutation endSuffrageVoting($id: String!) {
    endSuffrageVoting(id: $id) { ...suffrage }
  } ${suffrage}
`;

export const RESOLVE_SUFFRAGE = gql`
  mutation resolveSuffrage($id: String!) {
    resolveSuffrage(id: $id) { ...suffrage }
  } ${suffrage}
`;

//-----------------------------------------------------------------------------

