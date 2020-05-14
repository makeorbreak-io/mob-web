import React, { useCallback } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { last } from "lodash";

//
// gql
import { USERS } from "queries/admin";
import {
  MAKE_ADMIN,
  MAKE_PARTICIPANT,
  REMOVE_USER,
} from "mutations/admin";

//
// components
import {
  DataTable,
  CollapsibleContainer,
  EmailSender,
} from "components/uikit";

import {
  Section,
  Heading,
  Button,
} from "components/2020/uikit";

//
// constants
import { ADMIN } from "constants/roles";

const AdminUsers = () => {
  const { data, refetch } = useQuery(USERS);

  const [makeAdmin] = useMutation(MAKE_ADMIN);
  const [makeParticipant] = useMutation(MAKE_PARTICIPANT);
  const [removeUser] = useMutation(REMOVE_USER);

  const toggleRole = (user) => {
    const mutation = user.role === ADMIN ? makeParticipant : makeAdmin;

    return mutation({ variables: { id: user.id } })
      .then(refetch);
  };

  const renderActions = useCallback((selected) => (
    <>
      <EmailSender recipients={selected.map((r) => r.id)} />

      {selected.length === 1 &&
        <Button
          size="small"
          level="secondary"
          // className={classnames("icon", "icon--small", {
          //   "icon--star": selected[0].role !== ADMIN,
          //   "icon--star-border": selected[0].role === ADMIN,
          // })}
          confirmation={`Really make ${selected[0].displayName} a ${selected[0].role === ADMIN ? "participant" : "admin"}?`}
          onClick={() => toggleRole(selected[0])}
        >
          {selected[0].role === ADMIN ? "Make participant" : "Make admin" }
        </Button>
      }

      <Button
        size="small"
        level="secondary"
        // className="icon icon--small icon--delete"
        confirmation={`Really delete ${selected.length} users?`}
        onClick={() => Promise.all(selected.map(({ id }) => removeUser({ variables: { id }}))).then(refetch) }
      >
        Delete {selected.length} users
      </Button>
    </>
  ));

  return (
    <Section>
      <Heading size="xl">Users</Heading>

      <DataTable
        filter
        source={data?.users || []}
        labels={[ "Name"        , "Email" , "Role" , "Size" , "Workshops" , "Team"             , "GitHub" ]}
        mobile={[ true          , true    , true   , true   , false       , true               , true ]}
        sorter={[ "displayName" , "email" , "role" , null   , null        , "currentTeam.name" , null ]}
        search={[ "displayName", "role", "tshirtSize", "currentTeam.name" ]}
        actions={renderActions}
        render={(user, select) => (
          <tr key={user.id} className={user.role}>
            {select}
            <td>{user.displayName}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.tshirtSize}</td>
            <td>
              <CollapsibleContainer
                preview={`${user.events.length} workshops`}
              >
                {user.events?.map?.(({ slug }) => (
                  <div key={slug}>
                    <span className="tag purple">{slug}</span>
                  </div>
                ))}
              </CollapsibleContainer>
            </td>
            <td>{user.currentTeam && user.currentTeam.name}</td>
            <td className="github">{last((user.githubHandle || "").split("/"))}</td>
          </tr>
        )}
      />
    </Section>
  );
};

export default AdminUsers;
