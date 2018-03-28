import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Link } from "react-router";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { fullTeam } from "fragments";
import { waitForData } from "enhancers";

//
// components
import { DataTable, Button } from "components/uikit";

export class AdminTeams extends Component {

  //----------------------------------------------------------------------------
  // Lifecycle
  //----------------------------------------------------------------------------
  componentDidMount() {
    // this.props.dispatch(fetchTeams({ admin: true }));
  }

  componentWillUnmount() {
    // this.props.dispatch(clearTeams());
  }

  //----------------------------------------------------------------------------
  // Event Handlers
  //----------------------------------------------------------------------------
  setApplied = (id, applied) => {
    const { applyTeamToHackathon, deapplyTeamFromHackathon, data } = this.props;

    const func = !applied ? deapplyTeamFromHackathon : applyTeamToHackathon;

    return func({ variables: { id } })
    .then(() => data.refetch());
  }

  setAccepted = (id) => {
    const { acceptTeam, data } = this.props;

    return acceptTeam({ variables: { id } })
    .then(() => data.refetch());
  }

  makeEligible = (id) => {
    // return this.props.dispatch(updateTeam(id, { eligible: true }, { admin: true }));
    return id;
  }

  deleteAnyTeam = (id) => {
    const { deleteAnyTeam, data } = this.props;

    return deleteAnyTeam({ variables: { id } })
    .then(() => data.refetch());
  }

  disqualifyTeam = (id) => {
    // return this.props.dispatch(disqualifyTeam(id));
    return id;
  }

  removeMember = (id, teamId) => {
    // return this.props.dispatch(removeFromTeam(id, teamId, { admin: true }));
    return teamId;
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const teams = this.props.data.teams.edges.map(e => e.node);

    return (
      <div className="AdminTeams">
        <div className="content white">
          <div className="tools">
            <span className="left"><Link to="/admin">← Back to Admin</Link></span>
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
                  {(team.memberships.map((m, i) => (
                    <li key={i}>
                     <span>{m.user.displayName}</span>
                      <Button
                        className="remove"
                        small
                        danger
                        confirmation={`Remove ${m.displayName} from ${team.name}?`}
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
                        <span>{i.displayName}</span>
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
                    primary
                    small
                    fullwidth
                    confirmation={`Really accept ${team.name} in hackathon?`}
                    disabled={team.accepted}
                    onClick={() => this.setAccepted(team.id)}
                  >
                    {team.accepted ? "Accepted" : "Accept team"}
                  </Button>

                  <Button
                    danger
                    small
                    fullwidth
                    confirmation={`Really delete ${team.name}?`}
                    onClick={() => this.deleteAnyTeam(team.id)}
                  >
                    Delete Team
                  </Button>

                  {/*
                  <Button
                    danger
                    small
                    fullwidth
                    disabled={!!team.disqualified_at}
                    onClick={() => this.disqualifyTeam(team.id)}
                  >
                    Disqualify
                  </Button>
                  */}
                </td>
              </tr>
            )}
          />
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("AdminTeams"),

  graphql(gql`{
    teams(first: 1000) { edges { node { ...fullTeam } } }
  } ${fullTeam}`),

  graphql(
    gql`mutation applyTeamToHackathon($id: String!) {
      applyTeamToHackathon(id: $id) { ...fullTeam }
    } ${fullTeam}`,
    { name: "applyTeamToHackathon" },
  ),

  graphql(
    gql`mutation deapplyTeamFromHackathon($id: String!) {
      deapplyTeamFromHackathon(id: $id) { ...fullTeam }
    } ${fullTeam}`,
    { name: "deapplyTeamFromHackathon" },
  ),

  graphql(
    gql`mutation acceptTeam($id: String!) {
      acceptTeam(id: $id) { ...fullTeam }
    } ${fullTeam}`,
    { name: "acceptTeam" },
  ),

  graphql(
    gql`mutation deleteAnyTeam($id: String!) {
      deleteAnyTeam(id: $id)
    } ${fullTeam}`,
    { name: "deleteAnyTeam" },
  ),

  waitForData,
)(AdminTeams);
