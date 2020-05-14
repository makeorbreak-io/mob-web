import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { ADMIN_EVENTS } from "queries";
import { ADMIN_CREATE_EVENT } from "mutations";

import { useEditionSelector } from "hooks";

//
// components
import EventForm from "./Events.Form";
import {
  Button,
  Link,
  Section,
  Heading,
} from "components/2020/uikit";

import {
  DataTable,
} from "components/uikit";

const renderActions = (selected) => (
  <>
    <Button
        className="icon icon--small icon--delete"
        confirmation={`Really delete ${selected.length} users?`}
        onClick={() => selected.forEach(console.log)} // eslint-disable-line
    >
      Delete {selected.length} events
    </Button>
  </>
);

const AdminEvents = () => {
  const { selectedEdition, EditionSelector } = useEditionSelector();
  const { loading, data, refetch } = useQuery(ADMIN_EVENTS);
  const [createEvent] = useMutation(ADMIN_CREATE_EVENT);

  const save = (event) => (
    createEvent({ variables: { event: { ...event, editionId: selectedEdition.id } }})
      .then(() => refetch())
  );

  const events = loading
    ? []
    : data.events.filter((e) => e.editionId === selectedEdition?.id);

  return (
    <Section>
      <Heading size="xl">Events</Heading>

      <EditionSelector />

      <DataTable
        filter
        source={events}
        labels={[ "Slug" , "Name" , "Date" , "Signed Up" , "Limit" ]}
        sorter={[ "slug" , "name" , "shortDate" ]}
        search={[ "slug" , "name" ]}
        defaultSort="desc"
        actions={renderActions}
        render={(event, select) => (
          <tr key={event.id}>
            {select}
            <td><Link to={`/admin/events/${event.slug}`}>{event.slug}</Link></td>
            <td>{event.name}</td>
            <td>{event.shortDate}</td>
            <td>{event.attendances.length}</td>
            <td>{event.participantLimit}</td>
          </tr>
        )}
      />

      <EventForm save={save} />
    </Section>
  );
};

export default AdminEvents;
