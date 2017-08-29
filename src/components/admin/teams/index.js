import "./styles";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";
import { values } from "lodash";

//
// components
import { DataTable, Button } from "uikit";

//
// redux
import { fetchTeams, clearTeams, updateTeam, deleteTeam } from "actions/teams";

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
  deApplyTeam = (id) => {
    return this.props.dispatch(updateTeam(id, { applied: false }, { admin: true }));
  }

  deleteTeam = (id) => {
    return this.props.dispatch(deleteTeam(id, { admin: true }));
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { teams } = this.props;

    return (
      <div className="AdminTeams">
        <DataTable
          source={teams}
          labels={[ "Name" , "Applied" , "Project" , "Members" , "Invites", "Actions" ]}
          sorter={[ "name" , "applied" , null      , null      , null     , null ]}
          render={team => (
            <tr key={team.id}>
              <td>{team.name}</td>
              <td>{team.applied.toString()}</td>
              <td>{(team.project && team.project.name)}</td>
              <td>{(team.members || []).length}</td>
              <td>{(team.invites || []).length}</td>
              <td>
                <Button
                  danger
                  small
                  fullwidth
                  disabled={!team.applied}
                  confirmation={`Really de-apply ${team.name} from the hackathon?`}
                  onClick={() => this.deApplyTeam(team.id)}
                >
                  De-Apply
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
