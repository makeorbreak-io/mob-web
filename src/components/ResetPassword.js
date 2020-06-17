import React from "react";
import { useParams } from "react-router-dom";

//
// components
import {
  Field,
  Form,
  Heading,
  Link,
  P,
  Section,
} from "components/2020/uikit";

//
// api
import { recoverPassword } from "api/users";

//
// validation
import { validatePresence } from "validators";

const ResetPassword = () => {
  const { token } = useParams();

  const submit = ({ token, password }) => (
    recoverPassword(token, password)
  );

  return (
    <Section background="white" center>
      <Heading size="xl" color="purple" centered>
        Reset Password
      </Heading>

      <Form
        onSubmit={submit}
        submitLabel="Reset Password"
        initialValues={{ token, password: "" }}
      >
        {({ submitCount }) => (
          <>
            <Field name="token" type="hidden" component="input" />
            <Field
              name="password"
              type="password"
              component="input"
              placeholder="New password"
              label="New password"
              validate={validatePresence}
            />

            {submitCount > 0 &&
              <P>
                Your password was successfuly reset! You can now <Link to="/signin">sign in</Link> using your newly set password.
              </P>
            }
          </>
        )}
      </Form>
    </Section>
  );
};

export default ResetPassword;
