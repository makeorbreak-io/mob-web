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

    currentTeam {
      id
      name
      applied
      accepted
      memberships { user { id displayName gravatarHash } }
    }

    invitations {
      id
      host { id displayName }
      team { id name }
    }

    workshops { id slug name }

    currentBot: currentAiCompetitionBot {
      id title revision sdk
    }
  }
`;

export const fullTeam = gql`
  fragment fullTeam on Team {
    id
    name
    applied
    accepted

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

export const workshop = gql`
  fragment workshop on Workshop {
    id
    slug
    shortDate
    shortSpeaker
    name
    summary
    description
    speaker
    participantLimit
    year
    speakerImage
    bannerImage

    attendances { id checkedIn }
  }
`;
