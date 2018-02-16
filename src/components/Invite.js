import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { fullUser } from "fragments";

import { handleGraphQLErrors } from "lib/graphql";

//
// Components
import { Button } from "components/uikit";

export class Invite extends Component {
  acceptInvite = () => {
    const { invite: { id }, acceptInvite } = this.props;
    return acceptInvite({variables: { id }}).catch(handleGraphQLErrors);
  }

  rejectInvite = () => {
    const { invite: { id }, rejectInvite } = this.props;
    return rejectInvite({variables: { id }}).catch(handleGraphQLErrors);
  }

  render() {
    const { disabled, invite: { host, team } } = this.props;

    return (
      <div className="Invitation">
        <p>
          <b>{host.displayName}</b> invited you to join <b>{team.name}</b>
        </p>

        <div className="Actions">
          <Button small success disabled={disabled} onClick={this.acceptInvite}>Accept</Button>
          <Button small danger onClick={this.rejectInvite}>Reject</Button>
        </div>
      </div>
    );
  }
}

export default compose(
  setDisplayName("Invitation"),

  setPropTypes({
    disabled: PropTypes.bool.isRequired,
  }),

  defaultProps({
    disabled: false,
  }),

  graphql(
    gql`mutation acceptInvite($id: String!) {
      acceptInvite(id: $id) { ...fullUser }
    } ${fullUser}`,
    { name: "acceptInvite" },
  ),

  graphql(
    gql`mutation rejectInvite($id: String!) {
      rejectInvite(id: $id) { ...fullUser }
    } ${fullUser}`,
    { name: "rejectInvite" },
  ),
)(Invite);
