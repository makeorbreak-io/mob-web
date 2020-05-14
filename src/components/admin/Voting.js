import React, { useCallback } from "react";
import { parse, distanceInWords } from "date-fns";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { every } from "lodash";
// import cx from "classnames";

//
// gql
import { SUFFRAGES } from "queries";
import {
  ADMIN_CREATE_SUFFRAGE,
  // ADMIN_UPDATE_SUFFRAGE,
  ADMIN_DELETE_SUFFRAGE,
  ADMIN_START_SUFFRAGE_VOTING,
  ADMIN_END_SUFFRAGE_VOTING,
  ADMIN_RESOLVE_SUFFRAGE,
} from "mutations";

import { useEditionSelector } from "hooks";

//
// components
import { DataTable } from "components/uikit";
import {
  Button,
  Heading,
  Section,
} from "components/2020/uikit";
import ResourceCreator from "components/admin/ResourceCreator";

//
// validation
import { validatePresence, validateSlug } from "validators";

const suffrageFields = [
  { component: "input", type: "text", name: "name", placeholder: "Name", validate: validatePresence },
  { component: "input", type: "text", name: "slug", placeholder: "Slug", validate: validateSlug },
];

const formatDate = date => date && [distanceInWords(parse(`${date}Z`), Date()), "ago"].join(" ");


const AdminSuffrages = () => {
  const { selectedEdition, EditionSelector } = useEditionSelector();

  const { data, refetch } = useQuery(SUFFRAGES);

  const [create] = useMutation(ADMIN_CREATE_SUFFRAGE);
  // const [update] = useMutation(ADMIN_UPDATE_SUFFRAGE);
  const [remove] = useMutation(ADMIN_DELETE_SUFFRAGE);
  const [startVoting] = useMutation(ADMIN_START_SUFFRAGE_VOTING);
  const [endVoting] = useMutation(ADMIN_END_SUFFRAGE_VOTING);
  const [resolve] = useMutation(ADMIN_RESOLVE_SUFFRAGE);

  const suffrages = data?.suffrages?.filter((s) => s.editionId === selectedEdition?.id) || [];

  const renderActions = useCallback((selected) => {
    const all = (selected, method) => Promise.all(selected.map(({ id }) => method({ variables: { id }})));

    return (
      <>
        {every(selected, s => !s.votingStartedAt && !s.votingEndedAt) && (
          <Button
            size="small"
            level="secondary"
            // className="icon icon--small icon--play"
            confirmation={`Really open votes for ${selected.map(s => s.name).join(", ")}?`}
            onClick={() => all(selected, startVoting)}
          >
            Open Voting
          </Button>
        )}

        {every(selected, s => s.votingStartedAt && !s.votingEndedAt) && (
          <Button
            size="small"
            level="secondary"
            // className="icon icon--small icon--stop"
            confirmation={`Really close votes for ${selected.map(s => s.name).join(", ")}?`}
            onClick={() => all(selected, endVoting)}
          >
            Close Voting
          </Button>
        )}

        {every(selected, s => s.votingStartedAt && s.votingEndedAt) && (
          <Button
            size="small"
            level="secondary"
            // className="icon icon--small icon--how-to-vote"
            confirmation={`Really calculate podiums for ${selected.map(s => s.name).join(", ")}?`}
            onClick={() => all(selected, resolve)}
          >
            Resolve Votes
          </Button>
        )}

        <Button
          size="small"
          level="secondary"
          // className="icon icon--small icon--delete"
          confirmation={`Really delete ${selected.map(s => s.name).join(", ")}?`}
          onClick={() => all(selected, remove).then(refetch)}
        >
          Delete {selected.length} suffrages
        </Button>
      </>
    );
  });

  return (
    <Section>
      <Heading size="xl">Suffrages</Heading>
      <EditionSelector />

      <DataTable
        source={suffrages}
        labels={[ "Name" , "slug" , "Voting Started"  , "Voting Ended"  , "Podium" ]}
        sorter={[ "name" , "slug" , "votingStartedAt" , "votingEndedAt" , "podium" ]}
        search={[ "name" , "slug" , "votingStartedAt" , "votingEndedAt" , "podium" ]}
        editable
        fixed
        // sourceFields={[ ...suffrageFields, { empty: true }, { empty: true }, { empty: true } ]}
        // onUpdateSubmit={() => update}
        actions={renderActions}
        render={(suffrage, select, edit) => (
          <tr key={suffrage.id}>
            {select}
            <td>{suffrage.name}</td>
            <td>{suffrage.slug}</td>
            <td>{formatDate(suffrage.votingStartedAt)}</td>
            <td>{formatDate(suffrage.votingEndedAt)}</td>
            <td>{suffrage.podium && suffrage.podium.toString()}</td>
            {edit}
          </tr>
        )}
      />

      <ResourceCreator
        fields={suffrageFields}
        onSubmit={(suffrage) => create({ variables: { suffrage, editionId: selectedEdition.id }}).then(refetch)}
        label="Create Category"
      />
    </Section>
  );
};

export default AdminSuffrages;
