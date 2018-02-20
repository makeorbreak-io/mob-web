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

    currentBot: currentAiCompetitionBot {
      id title revision sdk
    }
  }
`;

export const fullTeam = gql`
  fragment fullTeam on Team {
    id
    name
    # technologies

    invites { id gravatarHash displayName }
    members { id displayName gravatarHash }
    memberships { user { id displayName gravatarHash } }
    competition { id name status }
  }
`;

export const aiCompetitionBot = gql`
  fragment aiCompetitionBot on AiCompetitionBot {
    id
    title
    revision
    sdk
    status
    compilationOutput
    insertedAt
  }
`;
