import React, { useState } from "react";


//
// components
import {
  Form,
  Field,
  Heading,
} from "components/2020/uikit";

import FormikEscapeHatch from "components/FormikEscapeHatch";
import EmailTemplate from "./EmailTemplate";

//
// Validation
import { validatePresence } from "validators";

// type Props = {
//   handleSubmit: () => void,
//   save: () => void,
//   remove: () => void,
//   submitting: boolean,
//   submitSucceeded: boolean,
//   buttonLabel: string,
//   form: string,
// }

const emailInitialValues = {
  name: "",
  subject: "",
  title: "",
  content: "",
};

const EmailForm = ({
  initialValues = emailInitialValues,
  onSubmit,
  submitLabel,
}) => {
  const [email, setEmail] = useState({});

  return (
    <div className="admin-form-with-preview">
      <Form {...{ onSubmit, initialValues, submitLabel }}>
        <FormikEscapeHatch onChange={({ values }) => setEmail(values)} />

        <Heading size="s">{submitLabel}</Heading>

        <Field
          name="name"
          label="Name"
          placeholder="Name (internal only)"
          validate={validatePresence}
        />

        <Field
          name="subject"
          label="Subject"
          placeholder="Subject"
          validate={validatePresence}
        />

        <Field
          name="title"
          label="Title"
          placeholder="Title"
          validate={validatePresence}
        />

        <Field
          name="content"
          label="Content (markdown)"
          placeholder="Content (markdown)"
          component="textarea"
          validate={validatePresence}
        />
      </Form>

      <EmailTemplate email={email} />
    </div>
  );
};

export default EmailForm;
