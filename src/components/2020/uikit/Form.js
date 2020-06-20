import React from "react";
import cx from "classnames";
import { Formik } from "formik";

import { Button } from "components/2020/uikit";

const Form = ({
  children,
  initialValues = {},
  inline = false,
  onSubmit,
  submitLabel = "Submit",
  validate,
  withoutSubmitButton,
  ...formProps
}) => (
  <Formik
    initialValues={initialValues}
    onSubmit={onSubmit}
    validate={validate}
    {...formProps}
  >
    {(props) => (
      <form
        className={cx("form", { "form--inline": inline })}
        onSubmit={props.handleSubmit}
      >
        {typeof children === "function" ? children(props) : children }

        {props.errors._error &&
          <div className="form__field form__field--text">
            <span className="form__field__error form__field__error--wide">{props.errors._error}</span>
          </div>
        }

        {!withoutSubmitButton &&
          <Button
            type="submit"
            level={inline ? "secondary" : "primary"}
            size={inline ? "small" : "large"}
            disabled={Object.values(props.touched).length === 0 || !props.isValid || props.isSubmitting}
          >
            {submitLabel}
          </Button>
        }
      </form>
    )}
  </Formik>
);

export default Form;
