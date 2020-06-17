import React from "react";
import { useField } from "formik";
import cx from "classnames";

const Field = ({
  children,
  component = "input",
  disabled,
  label,
  name,
  placeholder,
  type = "text",
  validate = () => {},
}) => {
  const id = `form-field-${name}`;
  const [field, meta] = useField({ name, validate });

  return (
    <div className={`form__field form__field--${type}`}>
      <label className="form__field__label" htmlFor={id}>{label}</label>

      {
        React.createElement(component, {
          id,
          disabled,
          type,
          placeholder,
          className: cx(`form__field__${component}`, { "form__field__input--error": meta.touched && meta.error }),
          ...field,
        }, children)
      }

      {meta.error && meta.touched &&
        <span className="form__field__error">{meta.error}</span>
      }
    </div>
  );
};

export default Field;
