import gql from "graphql-tag";

import {
  edition,
  email,
  event,
  fullUser,
  suffrage,
} from "fragments";

export const CURRENT_USER = gql`
  query me {
    me { ...fullUser }
  }
  ${fullUser}
`;

export const EDITIONS = gql`
  query editions {
    editions { ...edition }
  } ${edition}
`;

export const EVENT = gql`
  query event($slug: String!) {
    event(slug: $slug) {
      ...event
      users { id name email }
    }
  } ${event}
`;

export const SUFFRAGES = gql`
  query suffrages {
    suffrages { ...suffrage }
  } ${suffrage}
`;

//----------------------------------------------------------------------- Admin

export const ADMIN_EMAIL = gql`
  query email($id: String!) {
    email(id: $id) { ...email }
  } ${email}
`;

export const ADMIN_EMAILS = gql`
  query emails  {
    emails { ...email }
  } ${email}
`;

export const ADMIN_EVENTS = gql`
  query events {
    events {
      ...event
      users { id name email }
    }
  } ${event}
`;
