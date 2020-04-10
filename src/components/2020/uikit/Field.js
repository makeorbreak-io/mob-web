// @flow

import React from "react";
import { Field as FinalField } from "react-final-form";
import cx from "classnames";

const Field = ({
  label,
  name,
  placeholder,
  component: Component = "input",
  type = "text",
  validate = () => {},
  children,
  ...props
}) => {
  const id = `form-field-${name}`;

  return (
    <FinalField type={type} name={name} validate={validate} {...props}>
      {({ input, meta }) => (
        <div className={`form__field form__field--${type}`}>
          <label className="form__field__label" htmlFor={id}>{label}</label>

          {typeof Component === "string" &&
            React.createElement(Component, {
              ...input,
              id,
              type,
              placeholder,
              className: cx(`form__field__${Component}`, { "form__field__input--error": meta.touched && meta.error }),
            },
            children,
          )}

          {typeof Component === "function" &&
            <Component
              {...input}
              id={id}
              placeholder={placeholder}
            >
              {children}
            </Component>
          }

          {meta.error && meta.touched &&
            <span className="form__field__error">{meta.error}</span>
          }
        </div>
      )}
    </FinalField>
  );
};

export default Field;

