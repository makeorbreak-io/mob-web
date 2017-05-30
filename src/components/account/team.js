import React from "react";
import { compose, setDisplayName, mapProps } from "recompose";
import { get, isEmpty, map, filter, find } from "lodash";
import { connect } from "react-redux";

//
// Components
import Team from "components/team";
import Invitation from "components/invitation";

export const AccountTeam = ({
  currentUser,
  hasPendingInvitations,
  acceptedInvitation,
}) => {
  if (hasPendingInvitations) {
    return (
      <div className="AccountTeam">
        <h1>You have pending invitations</h1>
        <h3>If you wish to create a team, you must reject all invitations first.</h3>

        {map(currentUser.invitations, i => <Invitation key={i.id} invitation={i} />)}
      </div>
    );
  }

  const teamId = acceptedInvitation ? acceptedInvitation.team.id : get(currentUser, "team.id");

  return (
    <div className="AccountTeam">
      <Team id={teamId} editable={isEmpty(acceptedInvitation)} />
    </div>
  );
};

export default compose(
  setDisplayName("AccountTeam"),

  connect(({ currentUser }) => ({ currentUser })),

  mapProps(props => {
    const { currentUser: { team, invitations }} = props;

    return {
      ...props,
      hasPendingInvitations: isEmpty(team) && !isEmpty(filter(invitations, { accepted: false })),
      acceptedInvitation: find(invitations, { accepted: true }),
    };
  }),
)(AccountTeam);
