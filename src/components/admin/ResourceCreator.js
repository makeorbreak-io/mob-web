import React from "react";

import {
  Form,
  Field,
} from "components/2020/uikit";

export const ResourceCreator = ({
  fields,
  submitLabel,
  onSubmit,
}) => (
  <div className="resource-creator">
    <Form
      inline
      initialValues={fields.reduce((all, f) => ({ [f.name]: "", ...all }), {})}
      onSubmit={(values, actions) => onSubmit(values).then(actions.resetForm)}
      submitLabel={submitLabel}
    >
      {fields.map(({ options, ...field }) => (
        <Field key={field.name} {...field}>
          {options &&
            <>
              <option value="" disabled>{field.placeholder}</option>
              {options.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </>
          }
        </Field>
      ))}
    </Form>
  </div>
);

export default ResourceCreator;
