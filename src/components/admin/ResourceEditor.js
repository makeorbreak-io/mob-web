import React from "react";
import { compose } from "recompose";
import { reduxForm, Field } from "redux-form";

import { ErrorMessage } from "components/uikit";

export const ResourceEditor = ({
  form,
  fields,
  handleSubmit,
  onSubmit,
}) => {
  return fields.map(({ options, ...field }, i) => (field.empty ? <td key={i}/> :
    <td key={field.name}>
      {field.component === "select" &&
        <form className="form form--inline" onSubmit={handleSubmit(onSubmit)}>
        <Field {...field} className="input--short">
          <option value="" disabled>{field.placeholder}</option>
          {options.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Field>
        </form>
      }

      {field.component !== "select" &&
        <form className="form form--inline" onSubmit={handleSubmit(onSubmit)}>
          <Field {...field} className="input--short" />
        </form>
      }

      <ErrorMessage form={form} field={field.name} />
    </td>
  ));
};

export default compose(
  reduxForm({}),
)(ResourceEditor);

