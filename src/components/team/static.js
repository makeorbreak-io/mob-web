import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";

//
// Components
import TeamMembers from "./members";

export const StaticTeam = ({ team }) => {
  if (!team) return null;

  return (
    <div className="Team static">
      <h1>{team.name}</h1>

      <TeamMembers team={team} />
    </div>
  );
};

export default compose(
  setDisplayName("StaticTeam"),

  setPropTypes({
    team: PropTypes.object,
  }),
)(StaticTeam);
