import React, { Component, Fragment } from "react";
import { compose, setDisplayName } from "recompose";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { get, every } from "lodash";
import classnames from "classnames";

import { fullTeam, edition } from "fragments";
import { withEditionSelector, waitForData } from "enhancers";

//
// components
import { DataTable, CollapsibleContainer, Btn } from "components/uikit";

export class AdminTeams extends Component {

  componentDidMount() {
    const { data: { editions }, editionId, setEditionId } = this.props;

    if (!editionId) setEditionId(editions.find(c => c.isDefault).id);
  }

  mutate = (name, variables) => {
    const { data } = this.props;
    const f = get(this.props, name);

    return f({ variables })
    .then(() => data.refetch());
  }

  setApplied = ({ id }, applied) => {
    const { applyTeamToHackathon, deapplyTeamFromHackathon, data } = this.props;

    const func = !applied ? deapplyTeamFromHackathon : applyTeamToHackathon;

    return func({ variables: { id } })
    .then(() => data.refetch());
  }

  setAccepted    = ({ id }) => this.mutate("acceptTeam", { id })
  makeEligible   = ({ id }) => this.mutate("makeTeamEligible", { id })
  createRepo     = ({ id }) => this.mutate("createTeamRepo", { id })
  disqualifyTeam = ({ id }) => this.mutate("disqualifyTeam", { id })
  deleteAnyTeam  = ({ id }) => this.mutate("deleteAnyTeam", { id })
  removeMember   = (teamId, userId) => this.mutate("removeAnyMembership", { teamId, userId })

  renderActions = (selected) => (
    <Fragment>
      {every(selected, team => !team.accepted) &&
        <Btn
          className="icon icon--small icon--check-circle"
          confirmation={`Really accept ${selected.length} teams?`}
          onClick={() => selected.forEach(this.setAccepted)}
        >
          Accept {selected.length} teams
        </Btn>
      }


      {(every(selected, team => !team.applied) || every(selected, team => team.applied)) &&
        <Btn
          className={classnames("icon", "icon--small", {
            "icon--thumb-up": !selected[0].applied,
            "icon--thumb-down": selected[0].applied,
          })}
          confirmation={`Really ${selected[0].applied ? "de-apply" : "apply"} ${selected.length} teams?`}
          onClick={() => selected.forEach(team => this.setApplied(team, !team.applied))}
        >
          {selected[0].applied ? "De-apply" : "Apply"} {selected.length} teams
        </Btn>

      }

      {((every(selected, team => team.eligible || every(selected, team => !team.eligible)) &&
        <Btn
          className={classnames("icon", "icon--small", {
            "icon--check": !selected[0].eligible,
            "icon--close": selected[0].eligible,
          })}
          confirmation={`Really ${selected[0].eligible ? `disqualify ${selected.length} teams?` : `make ${selected.length} teams eligible for voting`}`}
          onClick={() => selected.forEach((selected[0].eligible ? this.disqualifyTeam : this.makeEligible))}
        >
          {selected[0].eligible
            ? `Disqualify ${selected.length} teams`
            : `Make ${selected.length} teams eligible`
          }
        </Btn>
      ))}

      {every(selected, team => !team.repo) &&
        <Btn
          className="icon icon--small icon--github"
          confirmation={`Really create repos for ${selected.length} teams?`}
          onClick={() => selected.forEach(this.setAccepted)}
        >
          Create {selected.length} repos
        </Btn>
      }

      <Btn
        className="icon icon--small icon--delete"
        confirmation={`Really delete ${selected.length} teams?`}
        onClick={() => selected.forEach(this.deleteAnyTeam)}
      >
        Delete {selected.length} teams
      </Btn>
    </Fragment>
  )

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { teams } = this.props.data.edition;

    return (
      <div className="admin--teams">
        <DataTable
          filter
          source={teams}
          labels={[ "Name" , "Accepted" , "Applied" , "Eligible", "Disqualified"   , "Project"     , "Repo" , "Categories" , "Members" , "Invites" ]}
          sorter={[ "name" , "accepted" , "applied" , "eligible", "isDisqualified" , "projectName" , null   , null         , null      , null ]}
          search={[ "name", "projectName" ]}
          actions={this.renderActions}
          render={(team, select) => (
            <tr key={team.id}>
              {select}
              <td>{team.name}</td>
              <td>{team.accepted.toString()}</td>
              <td>{team.applied.toString()}</td>
              <td>{team.eligible.toString()}</td>
              <td>{team.isDisqualified.toString()}</td>
              <td>{team.projectName}</td>
              <td>{team.repo ? "Yes" : "No"}</td>
              <td>
                <CollapsibleContainer
                  preview={`${team.suffrages.length} categories`}
                >
                  <ul>
                    {team.suffrages.map(s =>(
                      <li key={s.id}>{s.name}</li>
                    ))}
                  </ul>
                </CollapsibleContainer>
              </td>
              <td>
                <CollapsibleContainer
                  preview={`${team.memberships.length} members`}
                >
                  <ul>
                  {team.memberships.map((m, i) => (
                    <li key={i}>
                     <span>{m.user.displayName} (gh: {m.user.githubHandle})</span>
                      <Btn
                        className="icon icon--smal icon--delete"
                        confirmation={`Remove ${m.user.displayName} from ${team.name}?`}
                        onClick={() => this.removeMember(team.id, m.user.id)}
                      >Remove</Btn>
                    </li>
                  ))}
                  </ul>
                </CollapsibleContainer>
              </td>
              <td>
                <CollapsibleContainer
                  preview={`${team.invites.length} invites`}
                >
                  <ul>
                    {team.invites.map(i => (
                      <li key={i.id}>
                        <span>{i.displayName}</span>
                      </li>
                    ))}
                  </ul>
                </CollapsibleContainer>
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

  withEditionSelector,

  graphql(gql`query teams($editionId: String!) {
    edition(id: $editionId) {
      ...edition

      teams {
        ...fullTeam
        suffrages { id name }
      }
    }
  } ${fullTeam} ${edition}`,
  {
    options: ({ editionId }) => ({ variables: { editionId } }),
  }),

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
