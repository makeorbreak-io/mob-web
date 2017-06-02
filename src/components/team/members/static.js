import React from "react";
import { compose, setDisplayName } from "recompose";
import { map } from "lodash";

//
// Util
import { displayName } from "util/user";

export const StaticTeamMembers = ({ team, members }) => (

  <div className="TeamMembers static">
    <label>Team members</label>

    {displayName(team.owner)} (owner)
    <ul>
      {map(members, member => (
        <li key={member.invitee.id}>
          {displayName(member.invitee)}
        </li>
      ))}
    </ul>
  </div>
);

export default compose(
  setDisplayName("StaticTeamMembers"),
)(StaticTeamMembers);
