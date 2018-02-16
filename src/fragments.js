import gql from "graphql-tag";

export const fullUser = gql`
  fragment fullUser on User {
    id
    email
    name
    displayName
    tshirtSize
    birthday
    bio
    githubHandle
    twitterHandle
    linkedinUrl
    college
    employmentStatus
    company
    role
    gravatarHash

    invitations {
      id
      host { id displayName }
      team { id name }
    }
    teams {
      id name applied
      invites { id }
      memberships { user { id displayName } }
    }
  }
`;

export const fullTeam = gql`
  fragment fullTeam on Team {
    id
    name
    technologies

    invites { id gravatarHash displayName }
    members { id displayName gravatarHash }
    memberships { user { id displayName gravatarHash } }
    competition { id name status }
  }
`;
