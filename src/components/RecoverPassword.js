import React from "react";

//
// components
import {
  Field,
  Form,
  Heading,
  Section,
  P,
} from "components/2020/uikit";

//
// api
import { getPasswordRecoveryToken } from "api/users";

//
// validation
import { validateEmail } from "validators";

const RecoverPassword = () => {

  const submit = ({ email }) => (
    getPasswordRecoveryToken(email.trim().toLowerCase())
  );

  return (
    <Section background="white" center>
      <Heading size="xl" color="purple" centered>
        Password Recovery
      </Heading>

      <Form
        onSubmit={submit}
        submitLabel="Recover Password"
        initialValues={{ email: "" }}
      >
        {({ values, submitCount }) => (
          <>
            <Field
              label="Email"
              name="email"
              placeholder="Email"
              type="email"
              validate={validateEmail}
            />

            {submitCount > 0 &&
              <P>
                A recovery email was sent to {values.email}. Please check your inbox for further instructions.
              </P>
            }
          </>
        )}
      </Form>
    </Section>
  );
};

export default RecoverPassword;
