import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { EMAILS } from "queries/admin";
import { SEND_EMAIL } from "mutations/admin";

import { Button } from "components/2020/uikit";

const EmailSender = ({
  recipients,
}) => {
  const { data } = useQuery(EMAILS);
  const [id, setId] = useState("");
  const [sendEmail] = useMutation(SEND_EMAIL);

  const emails = data?.emails || [];

  return (
    <div className="email-sender">
      <div className="form__field">
        <div className="form__field__label" htmlFor="email-sender">
          Email:
        </div>

        <select
          value={id}
          onChange={(ev) => setId(ev.target.value)}
          id="email-sender"
          className="form__field__select"
        >
          <option value="" disabled>Select email</option>
          {emails.map(({ id, name }) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        <Button
          size="small"
          level="primary"
          disabled={!id}
          onClick={() => sendEmail({ variables: { id, recipients }}).then(() => setId(""))}
        >
          Send email to {recipients.length} recipients
        </Button>
      </div>
    </div>
  );
};

export default EmailSender;
