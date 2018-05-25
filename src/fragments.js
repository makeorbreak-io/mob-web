import gql from "graphql-tag";

export const fullUser = gql`
  fragment fullUser on User {
    id
    email
    name
    displayName
    tshirtSize
    githubHandle
    role
    gravatarHash
    dataUsageConsent
    spamConsent
    shareConsent

    currentAttendance { id checkedIn voterIdentity }

    currentTeam {
      id
      name
      applied
      accepted
      projectName

      memberships { user { id displayName gravatarHash } }
      invites { id gravatarHash displayName }
    }

    invitations {
      id
      host { id displayName }
      team { id name }
    }

    workshops { id slug name }

    favorites { id teamId }

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
    eligible
    isDisqualified
    prizePreference

    invites { id gravatarHash displayName }
    members { id displayName gravatarHash }
    memberships { user { id displayName gravatarHash githubHandle } }
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

    attendances { checkedIn user { id } }
  }
`;

export const suffrage = gql`
  fragment suffrage on Suffrage {
    id
    slug
    name
    votingStartedAt
    votingEndedAt

    teams { id projectName }
  }
`;

export const vote = gql`
 fragment vote on Vote {
   suffrageId
   ballot
 }
`;

export const paperVote = gql`
  fragment paperVote on PaperVote {
    id
    suffrageId
    redeemedAt
    annuledAt
  }
`;
