import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

// import { toInt } from "lib/redux-form";

//
// components
import {
  Field,
  Form,
  Heading,
} from "components/2020/uikit";

import FormikEscapeHatch from "components/FormikEscapeHatch";
// import Event from "components/Event";

//
// Validation
import { validatePresence, validateInt, validateSlug } from "validators";

const emptyInitialValues = {
  slug: "",
  shortDate: "",
  shortSpeaker: "",
  name: "",
  summary: "",
  description: "",
  speaker: "",
  participantLimit: "",
  year: "",
  type: "",
  speakerImage: "",
  bannerImage: "",
};

const Event = ({ event }) => {
  return (
    <div className="event">
      {event.bannerImage &&
        <div className="event__banner">
          <img src={event.bannerImage} alt={event.name} />
        </div>
      }

      <Heading size="xl" color="purple">{event.name || "Event Name"}</Heading>

      <Heading size="s">Summary</Heading>
      <ReactMarkdown source={event.summary || ""} />

      <Heading size="s">Description</Heading>
      <ReactMarkdown source={event.description || ""} />

      <Heading size="s">Speaker</Heading>
      <ReactMarkdown source={event.speaker|| ""} />
    </div>
  );
};

export const EventForm = ({
  save,
  initialValues,
}) => {
  const [event, setEvent] = useState({});

  return (
    <div className="admin-form-with-preview">
      <Form
        onSubmit={save}
        submitLabel="Create Event"
        initialValues={initialValues || emptyInitialValues}
      >
        <FormikEscapeHatch onChange={({ values }) => setEvent(values)} />

        <Heading size="s">Create New Event</Heading>

        <Field
          name="slug"
          label="Slug"
          placeholder="Slug"
          validate={validateSlug}
        />

        <Field
          name="shortDate"
          label="Short Date"
          placeholder="Short Date"
          validate={validatePresence}
        />

        <Field
          name="shortSpeaker"
          placeholder="Short Speaker"
          label="Short Speaker"
          validate={validatePresence}
        />

        <Field
          name="name"
          placeholder="Event name"
          label="Event name"
          validate={validatePresence}
        />

        <Field
          name="summary"
          placeholder="Event summary (markdown)"
          label="Event summary (markdown)"
          component="textarea"
          validate={validatePresence}
        />

        <Field
          name="description"
          placeholder="Event description (markdown)"
          label="Event description (markdown)"
          component="textarea"
          validate={validatePresence}
        />

        <Field
          name="speaker"
          label="Speaker (markdown)"
          placeholder="Speaker (markdown)"
          component="textarea"
          validate={validatePresence}
        />

        <Field
          name="participantLimit"
          type="number"
          label="Participant Limit"
          placeholder="Participant Limit"
          validate={validateInt}
        />

        <Field
          name="year"
          type="number"
          label="Year"
          placeholder="Year"
          validate={validateInt}
        />

        <Field
          name="speakerImage"
          label="Speaker Image (url)"
          placeholder="Speaker Image (url)"
          validate={validatePresence}
        />

        <Field
          name="bannerImage"
          label="Banner Image"
          placeholder="Banner Image"
          validate={validatePresence}
        />
      </Form>

      <div>
        <Heading size="s">Preview</Heading>
        <Event event={event} />
      </div>
    </div>
  );
};

export default EventForm;
