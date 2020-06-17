import React, { useCallback } from "react";
import { every } from "lodash";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { useEditionSelector } from "hooks";

import { TEAMS } from "queries/admin";
import {
  APPLY_TEAM_TO_HACKATHON,
  DEAPPLY_TEAM_FROM_HACKATHON,
  ACCEPT_TEAM,
  MAKE_TEAM_ELIGIBLE,
  CREATE_TEAM_REPO,
  DISQUALIFY_TEAM,
  DELETE_ANY_TEAM,
  REMOVE_ANY_MEMBERSHIP,
} from "mutations/admin";

//
// components
import {
  Button,
  Section,
  Heading,
} from "components/2020/uikit";

import {
  CollapsibleContainer,
  DataTable,
} from "components/uikit";

const AdminTeams = () => {
  const { selectedEdition, EditionSelector } = useEditionSelector();
  const { data, refetch } = useQuery(TEAMS, { variables: { editionId: selectedEdition?.id }});

  const [applyTeamToHackathon] = useMutation(APPLY_TEAM_TO_HACKATHON);
  const [deapplyTeamFromHackathon] = useMutation(DEAPPLY_TEAM_FROM_HACKATHON);
  const [acceptTeam] = useMutation(ACCEPT_TEAM);
  const [makeTeamEligible] = useMutation(MAKE_TEAM_ELIGIBLE);
  const [createTeamRepo] = useMutation(CREATE_TEAM_REPO);
  const [disqualifyTeam] = useMutation(DISQUALIFY_TEAM);
  const [deleteAnyTeam] = useMutation(DELETE_ANY_TEAM);
  const [removeAnyMembership] = useMutation(REMOVE_ANY_MEMBERSHIP);

  const renderActions = useCallback((selected) => {
    const all = (mutation) => Promise.all(selected.map(({ id }) => mutation({ variables: { id } }))).then(refetch);

    return (
      <>
        {every(selected, team => !team.accepted) &&
          <Button
            size="small"
            level="secondary"
            // className="icon icon--small icon--check-circle"
            confirmation={`Really accept ${selected.length} teams?`}
            onClick={() => all(acceptTeam)}
          >
            Accept {selected.length} teams
          </Button>
        }


        {(every(selected, team => !team.applied) || every(selected, team => team.applied)) &&
          <Button
            size="small"
            level="secondary"
            // className={classnames("icon", "icon--small", {
            //   "icon--thumb-up": !selected[0].applied,
            //   "icon--thumb-down": selected[0].applied,
            // })}
            confirmation={`Really ${selected[0].applied ? "de-apply" : "apply"} ${selected.length} teams?`}
            // onClick={() => selected.forEach(team => this.setApplied(team, !team.applied))}
            onClick={() => all(selected[0].applied ? deapplyTeamFromHackathon : applyTeamToHackathon)}
          >
            {selected[0].applied ? "De-apply" : "Apply"} {selected.length} teams
          </Button>

        }

        {((every(selected, team => team.eligible || every(selected, team => !team.eligible)) &&
          <Button
            size="small"
            level="secondary"
            // className={classnames("icon", "icon--small", {
            //   "icon--check": !selected[0].eligible,
            //   "icon--close": selected[0].eligible,
            // })}
            confirmation={`Really ${selected[0].eligible ? `disqualify ${selected.length} teams?` : `make ${selected.length} teams eligible for voting`}`}
            onClick={() => all(selected[0].eligible ? disqualifyTeam : makeTeamEligible )}
          >
            {selected[0].eligible
              ? `Disqualify ${selected.length} teams`
              : `Make ${selected.length} teams eligible`
            }
          </Button>
        ))}

        {every(selected, team => !team.repo) &&
          <Button
            size="small"
            level="secondary"
            // className="icon icon--small icon--github"
            confirmation={`Really create repos for ${selected.length} teams?`}
            onClick={() => all(createTeamRepo)}
          >
            Create {selected.length} repos
          </Button>
        }

        <Button
          size="small"
          level="secondary"
          // className="icon icon--small icon--delete"
          confirmation={`Really delete ${selected.length} teams?`}
          onClick={() => all(deleteAnyTeam)}
        >
          Delete {selected.length} teams
        </Button>
      </>
    );
  });

  return (
    <Section>
      <Heading size="xl">Teams</Heading>

      <EditionSelector />


    <DataTable
      filter
      source={data?.edition?.teams || []}
      labels={[ "Name" , "Accepted" , "Applied" , "Eligible", "Disqualified"   , "Project"     , "Repo" , "Categories" , "Members" , "Invites" ]}
      sorter={[ "name" , "accepted" , "applied" , "eligible", "isDisqualified" , "projectName" , null   , null         , null      , null ]}
      search={[ "name", "projectName" ]}
      actions={renderActions}
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
                  <Button
                    size="small"
                    // className="icon icon--smal icon--delete"
                    confirmation={`Remove ${m.user.displayName} from ${team.name}?`}
                    onClick={() => removeAnyMembership({ variables: { teamId: team.id, userId: m.user.id }})}
                  >
                    Remove
                  </Button>
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
    </Section>
  );
};

export default AdminTeams;
