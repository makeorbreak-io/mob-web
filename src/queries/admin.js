import gql from "graphql-tag";

import {
  email,
  fullTeam,
  fullUser,
  suffrage,
} from "fragments";

export const STATS = gql`
  query stats($editionId: String!) {
    adminStats { events }

    edition(id: $editionId) {
      id
      attendances { id checkedIn user { id role currentTeam { id } } }
      suffrages { id name teams { id } }
      teams { id applied accepted eligible }
    }
  }
`;

export const TEAMS = gql`
  query teams($editionId: String!) {
    edition(id: $editionId) {
      teams {
        ...fullTeam
        suffrages { id name }
      }
    }
  } ${fullTeam} ${suffrage}
`;

export const USERS = gql`
  query users {
    users { ...fullUser }
  } ${fullUser}
`;

export const EMAILS = gql`
  query emails  {
    emails { ...email }
  } ${email}
`;
