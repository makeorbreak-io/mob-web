import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";
import { get } from "lodash";
import { connect } from "react-redux";

//
// Components
import { Button } from "components/uikit";
import { Tabs, Tab, Panel } from "components/uikit/tabs";
import TeamMembers from "components/TeamMembers";

//
// Redux
import { removeFromTeam } from "actions/members";

export const StaticTeam = ({ team, currentUser, dispatch }) => {
  if (!team) return null;

  return (
    <div className="Team static">
      <Tabs selected={0}>
        <Tab><span>{team.name}</span></Tab>

        <Panel>
          <TeamMembers team={team} />

          {team.project_name &&
            <div className="Team-project">
              <label>Project</label>
              {team.project_name}
            </div>
          }

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
