import React from "react";
import { compose, setDisplayName } from "recompose";
import { get, isEmpty } from "lodash";
import { connect } from "react-redux";

//
// Components
import { Tabs, Tab, Panel } from "components/uikit/Tabs";
import Team from "components/Team";
import Invite from "components/Invite";

export const AccountTeam = ({ currentUser }) => {
  const teamId = get(currentUser, "team.id");
  const isInTeam = !isEmpty(teamId);

  return (
    <div className="AccountTeam" style={{ width: 500 }}>
      {!isEmpty(currentUser.invitations) &&
        <Tabs>
          <Tab><span>Pending Invites</span></Tab>

          <Panel>
            {isInTeam && <p className="small-notice">If you wish to accept any of these invites, you must first: leave your team, or delete your team, along with its members and project.</p>}
            {!isInTeam && <p className="small-notice">If you wish to create a team, you must reject all invitations first.</p>}

            {currentUser.invitations.map(i => (
              <Invite key={i.id} invite={i} disabled={!isEmpty(teamId)} />
            ))}
          </Panel>
        </Tabs>
      }

      <Team id={teamId} editable />
    </div>
  );
};

export default compose(
  setDisplayName("AccountTeam"),

  connect(({ currentUser }) => ({ currentUser })),
)(AccountTeam);
