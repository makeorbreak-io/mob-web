import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { EVENT } from "queries";
import { ADMIN_UPDATE_EVENT, ADMIN_DELETE_EVENT } from "mutations";

import {
  Button,
  Heading,
  Section,
} from "components/2020/uikit";

import EventForm from "./Events.Form";

const AdminEditEvent = () => {
  const { slug } = useParams();
  const { loading, data } = useQuery(EVENT, { variables: { slug } });
  const [updateEvent] = useMutation(ADMIN_UPDATE_EVENT);
  const [deleteEvent] = useMutation(ADMIN_DELETE_EVENT);

  const save = (event) => updateEvent({ variables: { slug, event } });
  const remove = () => deleteEvent({ variables: { slug }}).then(() => window.location.assign("/admin/events"));

  if (loading) return null;

  return (
    <Section>
      <Heading size="xl">Edit Event {data.event.name}</Heading>
      <EventForm save={save} initialValues={data.event} />

      <Button
        size="large"
        level="secondary"
        confirmation={`Really delete ${data.event.name}?`}
        onClick={remove}
      >
        Delete Event
      </Button>
    </Section>
  );
};

export default AdminEditEvent;
