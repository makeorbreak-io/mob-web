import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";
import { get } from "lodash";

//
// Components
import { Tabs, Tab, Panel } from "uikit/tabs";
import TeamMembers from "./members";
import Project from "components/project";

export const StaticTeam = ({ team }) => {
  if (!team) return null;

  const id = get(team, "project.id", null);

  return (
    <div className="Team static">
      <Tabs selected={0}>
      <Tab><span>{team.name}</span></Tab>

      <Panel>
        <TeamMembers team={team} />
        <Project {...{ id, team }} />
      </Panel>
      </Tabs>
    </div>
  );
};

export default compose(
  setDisplayName("StaticTeam"),

  setPropTypes({
    team: PropTypes.object,
  }),
)(StaticTeam);
