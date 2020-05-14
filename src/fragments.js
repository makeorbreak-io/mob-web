import gql from "graphql-tag";

export const edition = gql`
  fragment edition on Edition {
    id
    name
    status
    isDefault
  }
`;

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

      members { id displayName gravatarHash }
      invites { id displayName gravatarHash }
    }

    invitations {
      id
      host { id displayName }
      team { id name }
    }

    events { id slug name type }

    favorites { id teamId }

    # currentBot: currentAiEditionBot {
    #   id title revision sdk
    # }
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
    edition { id name status }
  }
`;

export const aiEditionBot = gql`
  fragment aiEditionBot on AiEditionBot {
    id
    title
    revision
    sdk
    status
    compilationOutput
    insertedAt
  }
`;

export const email = gql`
  fragment email on Email {
    id
    name
    subject
    title
    content
  }
`;

export const event = gql`
  fragment event on Event {
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
    editionId

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
    editionId
    podium

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
