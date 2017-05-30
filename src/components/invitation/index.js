import "./styles";

import React from "react";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";

//
// Components
import { Button } from "uikit";

//
// Util
import { displayName } from "util/user";

//
// Redux
import { acceptInvite, rejectInvite } from "actions/invites";

export const Invitation = ({
  invitation: {
    id,
    host,
    team,
  },
  dispatch,
}) => {
  return (
    <div className="Invitation">
      <span>
        You have been invited by <b>{displayName(host)}</b> to join their team <b>{team.name}</b>
      </span>

      <div className="Actions">
        <Button small success onClick={() => dispatch(acceptInvite(id))}>Accept</Button>
        <Button small danger onClick={() => dispatch(rejectInvite(id))}>Reject</Button>
      </div>
    </div>
  );
};

export default compose(
  setDisplayName("Invitation"),

  connect()
)(Invitation);
