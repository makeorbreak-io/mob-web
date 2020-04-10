// @flow

import React from "react";
import { Form as FinalForm } from "react-final-form";

import { Button } from "components/2020/uikit";

const Form = ({
  children,
  onSubmit,
  submitLabel = "Submit",
  validate,
  withoutSubmitButton,
  ...props
}) => (
  <FinalForm
    onSubmit={onSubmit}
    validate={validate}
    render={(props) => (
      <form className="form" onSubmit={props.handleSubmit}>
        {typeof children === "function" ? children(props) : children }

        {!withoutSubmitButton &&
          <Button type="submit" level="primary" size="large">
            {submitLabel}
          </Button>
        }
      </form>
    )}

    {...props}
  />
);

export default Form;
