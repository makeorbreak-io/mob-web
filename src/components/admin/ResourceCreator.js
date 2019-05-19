import React from "react";
import { compose } from "recompose";
import { reduxForm, Field } from "redux-form";

import { Btn, ErrorMessage } from "components/uikit";

export const ResourceCreator = ({
  form,
  fields,
  handleSubmit,
  onSubmit,
  label,
  reset,
}) => {
  const submit = (values) => { onSubmit(values); reset(); };

  return (
    <div className="resource-creator">
      <form className="form form--inline" onSubmit={handleSubmit(submit)}>
        {fields.map(({ options, ...field }) => (
          <div key={field.name}>
            {field.component === "select" &&
              <Field {...field}>
                <option value="" disabled>{field.placeholder}</option>
                {options.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Field>
            }

            {field.component !== "select" && <Field {...field} />}

            <ErrorMessage form={form} field={field.name} />
          </div>
        ))}

        <Btn type="submit" className="btn btn--submit icon icon--add-circle">{label || "Create"}</Btn>
      </form>
    </div>
  );
};

export default compose(
  reduxForm({}),
)(ResourceCreator);
