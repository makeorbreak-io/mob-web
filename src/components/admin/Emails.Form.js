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
    validatePresence("name", "Name"),
    validatePresence("subject", "Subject"),
  )(values);
};

export const EmailForm = ({
  handleSubmit,
  save,
  remove,
  submitting,
  submitSucceeded,
  buttonLabel,
  form,
}) => (
  <form onSubmit={handleSubmit(save)}>
    <label htmlFor="name">Identifier</label>
    <Field id="name" name="name" component="input" type="text" placeholder="Identifier" className="fullwidth" />
    <ErrorMessage form={form} field="name" />

    <label htmlFor="subject">Subject</label>
    <Field id="subject" name="subject" component="input" type="text" placeholder="Subject" className="fullwidth" />
    <ErrorMessage form={form} field="subject" />

    <label htmlFor="title">Title</label>
    <Field id="title" name="title" component="input" type="text" placeholder="Title" className="fullwidth" />
    <ErrorMessage form={form} field="title" />

    <label htmlFor="content">Content (html)</label>
    <Field id="content" name="content" component="textarea" placeholder="Content"  className="fullwidth"/>
    <ErrorMessage form={form} field="content" />

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
        confirmation="Really delete email?"
        onClick={remove}
      >
        Delete email
      </Button>
    }
  </form>
);

export default compose(
  setDisplayName("EmailForm"),

  setPropTypes({
    handleSubmit: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    remove: PropTypes.func,
    submitting: PropTypes.bool.isRequired,
    submitSucceeded: PropTypes.bool.isRequired,
    buttonLabel: PropTypes.string.isRequired,
    form: PropTypes.string.isRequired,
  }),
)(EmailForm);

