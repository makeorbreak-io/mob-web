import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Link } from "react-router";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { get } from "lodash";

import { fullTeam } from "fragments";
import { waitForData } from "enhancers";

//
// components
import { DataTable, Button } from "components/uikit";

export class AdminTeams extends Component {

  mutate = (name, variables) => {
    const { data } = this.props;
    const f = get(this.props, name);

    return f({ variables })
    .then(() => data.refetch());
  }

  setApplied = (id, applied) => {
    const { applyTeamToHackathon, deapplyTeamFromHackathon, data } = this.props;

    const func = !applied ? deapplyTeamFromHackathon : applyTeamToHackathon;

    return func({ variables: { id } })
    .then(() => data.refetch());
  }

  setAccepted    = (id) => this.mutate("acceptTeam", { id })
  makeEligible   = (id) => this.mutate("makeTeamEligible", { id })
  createRepo     = (id) => this.mutate("createTeamRepo", { id })
  disqualifyTeam = (id) => this.mutate("disqualifyTeam", { id })
  deleteAnyTeam  = (id) => this.mutate("deleteAnyTeam", { id })
  removeMember   = (teamId, userId) => this.mutate("removeAnyMembership", { teamId, userId })

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
            search={[ "name", "projectName" ]}
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
                        confirmation={`Remove ${m.user.displayName} from ${team.name}?`}
                        onClick={() => this.removeMember(team.id, m.user.id)}
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
                <td className="actions">
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
                    primary
                    small
                    fullwidth
                    disabled={team.eligible && !team.disqualifiedAt}
                    onClick={() => this.makeEligible(team.id)}
                  >
                    Make eligible
                  </Button>

                  <Button
                    primary
                    small
                    fullwidth
                    disabled={team.repo}
                    onClick={() => this.createRepo(team.id)}
                  >
                    Create github repo
                  </Button>

                  <Button
                    danger
                    small
                    fullwidth
                    disabled={team.isDisqualified}
                    onClick={() => this.disqualifyTeam(team.id)}
                  >
                    Disqualify
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

  waitForData,

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
    gql`mutation makeTeamEligible($id: String!) {
      makeTeamEligible(id: $id) { ...fullTeam }
    } ${fullTeam}`,
    { name: "makeTeamEligible" },
  ),

  graphql(
    gql`mutation createTeamRepo($id: String!) {
      createTeamRepo(id: $id) { ...fullTeam }
    } ${fullTeam}`,
    { name: "createTeamRepo" },
  ),

  graphql(
    gql`mutation disqualifyTeam($id: String!) {
      disqualifyTeam(id: $id) { ...fullTeam }
    } ${fullTeam}`,
    { name: "disqualifyTeam" },
  ),

  graphql(
    gql`mutation deleteAnyTeam($id: String!) {
      deleteAnyTeam(id: $id)
    } ${fullTeam}`,
    { name: "deleteAnyTeam" },
  ),

  graphql(
    gql`mutation removeAnyMembership($teamId: String!, $userId: String!) {
      removeAnyMembership(teamId: $teamId, userId: $userId) { ...fullTeam }
    } ${fullTeam}`,
    { name: "removeAnyMembership" },
  ),
)(AdminTeams);
