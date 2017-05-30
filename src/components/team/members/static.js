import React from "react";
import { compose, setDisplayName } from "recompose";
import { map } from "lodash";

//
// Components
import { FormSectionHeader } from "uikit";

//
// Util
import { displayName } from "util/user";

export const StaticTeamMembers = ({ members }) => (

  <div className="TeamMembers static">
    <FormSectionHeader>Team members</FormSectionHeader>

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
