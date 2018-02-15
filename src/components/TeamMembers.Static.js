import React from "react";
import { compose, setDisplayName } from "recompose";
import { map, get } from "lodash";
import { connect } from "react-redux";

//
// Components
import { Avatar } from "components/uikit";

export const StaticTeamMembers = ({ team, currentUser }) => (

  <div className="TeamMembers static">
    <label>Team members</label>

    <ul className="Members">

      <li className="Member owner">
        <Avatar user={team.owner} />
        {team.owner.display_name} (owner)
      </li>

      {map(team.members, member => (
        <li key={member.id} className="Member">
          <Avatar user={member} />
          {member.display_name}
          {member.id === get(currentUser, "id") && " (that's you!)"}
        </li>
      ))}
    </ul>
  </div>
);

export default compose(
  setDisplayName("StaticTeamMembers"),

  connect(({ currentUser }) => ({ currentUser })),
)(StaticTeamMembers);
