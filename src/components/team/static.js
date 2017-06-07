import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";
import { get } from "lodash";
import { connect } from "react-redux";

//
// Components
import { Button } from "uikit";
import { Tabs, Tab, Panel } from "uikit/tabs";
import TeamMembers from "./members";
import Project from "components/project";

//
// Redux
import { removeFromTeam } from "actions/members";

export const StaticTeam = ({ team, currentUser, dispatch }) => {
  if (!team) return null;

  const id = get(team, "project.id", null);

  return (
    <div className="Team static">
      <Tabs selected={0}>
        <Tab><span>{team.name}</span></Tab>

        <Panel>
          <TeamMembers team={team} />
          <Project {...{ id, team }} />

          {currentUser && get(currentUser, "team.id") === team.id &&
            <div className="danger-zone">
              <Button form fullwidth centered danger onClick={() => dispatch(removeFromTeam(currentUser.id, team.id))}>
                Leave "{team.name}"
              </Button>

              <p>If you wish back on this team, you'll need to be invited again by the team owner.</p>
            </div>
          }

        </Panel>
      </Tabs>
    </div>
  );
};

export default compose(
  setDisplayName("StaticTeam"),

  connect(({ currentUser }) => ({ currentUser })),

  setPropTypes({
    team: PropTypes.object,
  }),
)(StaticTeam);
