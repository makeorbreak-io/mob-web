import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";
import { Field } from "redux-form";

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
    validatePresence("short_speaker", "Short speaker"),
    validatePresence("name", "Name"),
    validatePresence("summary", "Summary"),
    validatePresence("description", "Description"),
    validatePresence("speaker", "Speaker"),
    validatePresence("participant_limit", "Participant Limit"),
    validatePresence("year", "Year"),
  )(values);
};

export const WorkshopForm = ({
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

    <label htmlFor="short_date">Short Date</label>
    <Field id="short_date" name="short_date" component="input" type="text" placeholder="Short Date" className="fullwidth" />
    <ErrorMessage form={form} field="short_date" />

    <label htmlFor="short_speaker">ShortSpeaker</label>
    <Field id="short_speaker" name="short_speaker" component="input" type="text" placeholder="ShortSpeaker" className="fullwidth" />
    <ErrorMessage form={form} field="short_speaker" />

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

    <label htmlFor="participant_limit">Participant Limit</label>
    <Field id="participant_limit" name="participant_limit" component="input" type="number" placeholder="Participant Limit"  className="fullwidth"/>
    <ErrorMessage form={form} field="participant_limit" />

    <label htmlFor="year">Year</label>
    <Field id="year" name="year" component="input" type="text" placeholder="Year"  className="fullwidth"/>
    <ErrorMessage form={form} field="year" />

    <label htmlFor="speaker_image">Speaker Image (url)</label>
    <Field id="speaker_image" name="speaker_image" component="input" type="text" placeholder="Speaker Image"  className="fullwidth"/>
    <ErrorMessage form={form} field="speaker_image" />

    <label htmlFor="banner_image">Banner Image (url)</label>
    <Field id="banner_image" name="banner_image" component="input" type="text" placeholder="Banner Image"  className="fullwidth"/>
    <ErrorMessage form={form} field="banner_image" />

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
        confirmation="Really delete workshop?"
        onClick={remove}
      >
        Delete workshop
      </Button>
    }
  </form>
);

export default compose(
  setDisplayName("WorkshopForm"),

  setPropTypes({
    handleSubmit: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    remove: PropTypes.func,
    submitting: PropTypes.bool.isRequired,
    submitSucceeded: PropTypes.bool.isRequired,
    buttonLabel: PropTypes.string.isRequired,
    form: PropTypes.string.isRequired,
  }),
)(WorkshopForm);
