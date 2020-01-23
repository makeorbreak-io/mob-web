// @flow

import React from "react";
import { Field as FinalField } from "react-final-form";
import cx from "classnames";

const Field = ({
  label,
  name,
  placeholder,
  type = "text",
  validate = () => {},
}) => {
  const id = `form-field-${name}`;

  return (
    <FinalField name={name} validate={validate}>
      {({ input, meta }) => (
        <div className={`form__field form__field--${type}`}>
          <label className="form__field__label" htmlFor={id}>{label}</label>

          <input
            {...input}
            id={id}
            type={type}
            placeholder={placeholder}
            className={cx("form__field__input", { "form__field__input--error": meta.touched && meta.error })}
          />

          {meta.error && meta.touched &&
            <span className="form__field__error">{meta.error}</span>
          }
        </div>
      )}
    </FinalField>
  );
};

export default Field;

