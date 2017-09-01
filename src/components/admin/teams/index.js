import "./styles";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";
import { values, get } from "lodash";

//
// components
import { DataTable, Button } from "uikit";

//
// redux
import { fetchTeams, clearTeams, updateTeam, deleteTeam, disqualifyTeam } from "actions/teams";
import { removeFromTeam } from "actions/members";

//
// api
import { syncInvites } from "api/admin";

export class AdminTeams extends Component {

  //----------------------------------------------------------------------------
  // Lifecycle
  //----------------------------------------------------------------------------
  componentDidMount() {
    this.props.dispatch(fetchTeams({ admin: true }));
  }

  componentWillUnmount() {
    this.props.dispatch(clearTeams());
  }

  //----------------------------------------------------------------------------
  // Event Handlers
  //----------------------------------------------------------------------------
  setApplied = (id, applied) => {
    return this.props.dispatch(updateTeam(id, { applied }, { admin: true }));
  }

  makeEligible = (id) => {
    return this.props.dispatch(updateTeam(id, { eligible: true }, { admin: true }));
  }

  deleteTeam = (id) => {
    return this.props.dispatch(deleteTeam(id, { admin: true }));
  }

  disqualifyTeam = (id) => {
    return this.props.dispatch(disqualifyTeam(id));
  }

  removeMember = (id, teamId) => {
    return this.props.dispatch(removeFromTeam(id, teamId, { admin: true }));
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { teams } = this.props;

    return (
      <div className="AdminTeams">

        <div className="tools">
          <Button primary onClick={syncInvites}>Fix invites</Button>
        </div>

        <DataTable
          source={teams}
          labels={[ "Name" , "Project" , "Members" , "Invites", "Actions" ]}
          sorter={[ "name" , null      , null      , null     , null ]}
          render={team => (
            <tr key={team.id}>
              <td>{team.name}</td>
              <td>{(team.project && team.project.name)}</td>
              <td>
                <ul>
                {(team.members.map(m => (
                  <li key={m.id}>
                   <span>{m.display_name}</span>
                    <Button
                      className="remove"
                      small
                      danger
                      confirmation={`Remove ${m.display_name} from ${team.name}?`}
                      onClick={() => this.removeMember(m.id, team.id)}
                    >×</Button>
                  </li>
                )))}
                </ul>
              </td>
              <td>
                <ul>
                  {(team.invites.map(i => (
                    <li key={i.id}>
                      <span>{get(i, "invitee.display_name", i.email)}</span>
                    </li>
                  )))}
                </ul>
              </td>
              <td>
                <Button
                  danger={team.applied}
                  primary={!team.applied}
                  small
                  fullwidth
                  confirmation={`Really ${team.applied ? "remove" : "add"} ${team.name} ${team.applied ? "from" : "to"} the hackathon?`}
                  onClick={() => this.setApplied(team.id, !team.applied)}
                >
                  {team.applied ? "De-apply" : "Apply"}
                </Button>
                <Button
                  danger
                  small
                  fullwidth
                  confirmation={`Really delete ${team.name}?`}
                  onClick={() => this.deleteTeam(team.id)}
                >
                  Delete Team
                </Button>

                <Button
                  primary
                  small
                  fullwidth
                  disabled={team.eligible}
                  onClick={() => this.makeEligible(team.id)}
                >
                  Make eligible
                </Button>

                <Button
                  danger
                  small
                  fullwidth
                  disabled={!!team.disqualified_at}
                  onClick={() => this.disqualifyTeam(team.id)}
                >
                  Disqualify
                </Button>
              </td>
            </tr>
          )}
        />
      </div>
    );
  }

}

export default compose(
  setDisplayName("AdminTeams"),

  connect(({ teams }) => ({ teams: values(teams) })),
)(AdminTeams);
