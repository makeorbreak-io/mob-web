import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";

export const StaticTeam = ({ team }) => {
  return (
    <div className="Team static">
      {team.id}
    </div>
  );
};

export default compose(
  setDisplayName("StaticTeam"),

  setPropTypes({
    team: PropTypes.object,
  }),
)(StaticTeam);
