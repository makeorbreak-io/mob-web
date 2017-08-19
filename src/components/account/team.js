import React from "react";
import { compose, setDisplayName } from "recompose";
import { get, isEmpty, map } from "lodash";
import { connect } from "react-redux";

//
// Components
import { Tabs, Tab, Panel } from "uikit/tabs";
import Team from "components/team";
import Invitation from "components/invitation";

export const AccountTeam = ({ currentUser }) => {
  const teamId = get(currentUser, "team.id");
  const isInTeam = !isEmpty(teamId);

  return (
    <div className="AccountTeam" style={{ width: 500 }}>
      {!isEmpty(currentUser.invitations) &&
        <Tabs>
          <Tab><span>Pending Invites</span></Tab>

          <Panel>
            {isInTeam && <p className="small-notice">If you wish to accept any of these invites, you must first delete your team, along with its members and project.</p>}
            {!isInTeam && <p className="small-notice">If you wish to create a team, you must reject all invitations first.</p>}

            {map(currentUser.invitations, i => <Invitation key={i.id} invitation={i} disabled={!isEmpty(teamId)} />)}
          </Panel>
        </Tabs>
      }

      {isEmpty(currentUser.invitations) &&
        <Team id={teamId} editable />
      }
    </div>
  );
};

export default compose(
  setDisplayName("AccountTeam"),

  connect(({ currentUser }) => ({ currentUser })),
)(AccountTeam);
