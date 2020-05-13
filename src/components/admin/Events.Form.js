import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";
import { Field } from "redux-form";

import { toInt } from "lib/redux-form";

//
// components
import { Button, ErrorMessage } from "components/uikit";

//
// Validation
import { composeValidators, validatePresence } from "validators";

export const validate = (values) => {
  return composeValidators(
    validatePresence("slug", "Slug"),
    validatePresence("short_date", "Short date"),
    validatePresence("shortSpeaker", "Short speaker"),
    validatePresence("name", "Name"),
    validatePresence("summary", "Summary"),
    validatePresence("description", "Description"),
    validatePresence("speaker", "Speaker"),
    validatePresence("participantLimit", "Participant Limit"),
    validatePresence("year", "Year"),
  )(values);
};

export const EventForm = ({
  handleSubmit,
  save,
  remove,
  submitting,
  submitSucceeded,
  buttonLabel,
  form,
}) => (
  <form onSubmit={handleSubmit(save)}>
    <label htmlFor="slug">Slug</label>
    <Field id="slug" name="slug" component="input" type="text" placeholder="Slug" className="fullwidth" />
    <ErrorMessage form={form} field="slug" />

    <label htmlFor="shortDate">Short Date</label>
    <Field id="shortDate" name="shortDate" component="input" type="text" placeholder="Short Date" className="fullwidth" />
    <ErrorMessage form={form} field="shortDate" />

    <label htmlFor="shortSpeaker">ShortSpeaker</label>
    <Field id="shortSpeaker" name="shortSpeaker" component="input" type="text" placeholder="ShortSpeaker" className="fullwidth" />
    <ErrorMessage form={form} field="shortSpeaker" />

    <label htmlFor="name">Name</label>
    <Field id="name" name="name" component="input" type="text" placeholder="Name"  className="fullwidth"/>
    <ErrorMessage form={form} field="name" />

    <label htmlFor="summary">Summary (markdown)</label>
    <Field id="summary" name="summary" component="textarea" placeholder="Summary"  className="fullwidth"/>
    <ErrorMessage form={form} field="summary" />

    <label htmlFor="description">Description (markdown)</label>
    <Field id="description" name="description" component="textarea" placeholder="Description"  className="fullwidth"/>
    <ErrorMessage form={form} field="description" />

    <label htmlFor="speaker">Speaker (markdown)</label>
    <Field id="speaker" name="speaker" component="textarea" placeholder="Speaker"  className="fullwidth"/>
    <ErrorMessage form={form} field="speaker" />

    <label htmlFor="participantLimit">Participant Limit</label>
    <Field id="participantLimit" name="participantLimit" component="input" type="number" placeholder="Participant Limit"  className="fullwidth" parse={toInt}/>
    <ErrorMessage form={form} field="participantLimit" />

    <label htmlFor="year">Year</label>
    <Field id="year" name="year" component="input" type="text" placeholder="Year"  className="fullwidth" parse={toInt} />
    <ErrorMessage form={form} field="year" />

    <label htmlFor="speaker_image">Speaker Image (url)</label>
    <Field id="speakerImage" name="speakerImage" component="input" type="text" placeholder="Speaker Image"  className="fullwidth"/>
    <ErrorMessage form={form} field="speakerImage" />

    <label htmlFor="banner_image">Banner Image (url)</label>
    <Field id="bannerImage" name="bannerImage" component="input" type="text" placeholder="Banner Image"  className="fullwidth"/>
    <ErrorMessage form={form} field="bannerImage" />

    <Button
      type="submit"
      primary
      form
      centered
      fullwidth
      disabled={submitting}
      loading={submitting}
      submitSucceeded={submitSucceeded}
    >
      {buttonLabel}
    </Button>

    {remove &&
      <Button
        type="button"
        danger
        form
        centered
        fullwidth
        confirmation="Really delete event?"
        onClick={remove}
      >
        Delete event
      </Button>
    }
  </form>
);

export default compose(
  setDisplayName("EventForm"),

  setPropTypes({
    handleSubmit: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    remove: PropTypes.func,
    submitting: PropTypes.bool.isRequired,
    submitSucceeded: PropTypes.bool.isRequired,
    buttonLabel: PropTypes.string.isRequired,
    form: PropTypes.string.isRequired,
  }),
)(EventForm);
