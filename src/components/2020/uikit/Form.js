// @flow

import React from "react";
import { Form as FinalForm } from "react-final-form";

import { Button } from "components/2020/uikit";

const Form = ({
  children,
  onSubmit,
  submitLabel = "Submit",
  validate,
}) => {
  return (
    <FinalForm
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit }) => (
        <form className="form" onSubmit={handleSubmit}>
          {children}

          <Button type="submit" level="primary" size="large">
            {submitLabel}
          </Button>
        </form>
      )}
    />
  );
};

export default Form;
