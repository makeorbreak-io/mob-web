import React, { useCallback } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import cx from "classnames";

import { EDITIONS } from "queries";
import {
  ADMIN_CREATE_EDITION,
  ADMIN_UPDATE_EDITION,
  ADMIN_SET_DEFAULT_EDITION,
  ADMIN_DELETE_EDITION,
} from "mutations";

import { DataTable } from "components/uikit";
import {
  Button,
  Heading,
  Section,
} from "components/2020/uikit";

import ResourceCreator from "components/admin/ResourceCreator";

import { validatePresence } from "validators";

const editionFields = [
  { component: "input", type: "text", name: "name", placeholder: "Name", validate: validatePresence },
  {
    component: "select", name: "status", placeholder: "Status", validate: validatePresence, options: [
      { value: "created" , label: "Created" },
      { value: "started" , label: "Started" },
      { value: "ended"   , label: "Ended" },
    ],
  },
];

export const AdminEditions = () => {
  const { data, refetch } = useQuery(EDITIONS);

  const [createEdition] = useMutation(ADMIN_CREATE_EDITION);
  const [updateEdition] = useMutation(ADMIN_UPDATE_EDITION);
  const [setDefaultEdition] = useMutation(ADMIN_SET_DEFAULT_EDITION);
  const [deleteEdition] = useMutation(ADMIN_DELETE_EDITION);

  const create = useCallback((edition) => createEdition({ variables: { edition }}).then(refetch));
  const update = useCallback(({ id }, edition) => updateEdition({ variables: { id, edition }}).then(refetch));
  const setDefault = useCallback(({ id }) => setDefaultEdition({ variables: { id }}).then(refetch));
  const remove = useCallback(({ id }) => deleteEdition({ variables: { id }}).then(refetch));

  const renderActions = (selected) => (
    <>
      {selected.length === 1 &&
        <Button
          size="small"
          level="secondary"
          // className="icon icon--small icon--star"
          confirmation={`Really make "${selected[0].name}" the default edition?`}
          onClick={() => setDefault(selected[0])}
        >
          Set as default edition
        </Button>
      }

      {data.editions.length > 1 &&
        <Button
          size="small"
          level="secondary"
          // className="icon icon--small icon--delete"
          confirmation={`Really delete ${selected.length} editions?`}
          onClick={() => Promise.all(selected.map(remove)).then(refetch)}
        >
          Delete {selected.length} editions
        </Button>
      }
    </>
  );

  return (
    <Section>
      <Heading size="xl">Editions</Heading>

      <DataTable
        source={data?.editions}
        labels={[ "Default" , "Name" , "Status" ]}
        sorter={[ "default" , "name" , "status" ]}
        search={[ "default" , "name" , "status" ]}
        actions={renderActions}
        editable
        sourceFields={[{ empty: true }, ...editionFields]}
        onUpdateSubmit={update}
        fixed
        render={(edition, select, edit) => (
          <tr
            key={edition.id}
            className={cx({ status: edition.status, default: edition.isDefault })}
          >
            {select}
            <td>{edition.isDefault.toString()}</td>
            <td>{edition.name}</td>
            <td>{edition.status}</td>
            {edit}
          </tr>
        )}
      />

      <ResourceCreator
        fields={editionFields}
        onSubmit={create}
        label="Create Edition"
      />
    </Section>
  );
};

export default AdminEditions;
