import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { ADMIN_EMAIL } from "queries";
import {
  ADMIN_UPDATE_EMAIL,
  ADMIN_DELETE_EMAIL,
} from "mutations";

import {
  Button,
  Heading,
  Section,
} from "components/2020/uikit";

import EmailForm from "components/admin/Emails.Form";

const AdminEditEmail = () => {
  const { id } = useParams();
  const { loading, data } = useQuery(ADMIN_EMAIL, { variables: { id } });
  const [updateEmail] = useMutation(ADMIN_UPDATE_EMAIL);
  const [deleteEmail] = useMutation(ADMIN_DELETE_EMAIL);

  const update = (email) => updateEmail({ variables: { id, email } });
  const remove = () => deleteEmail({ variables: { id }}).then(() => window.location.assign("/admin/emails"));

  if (loading) return null;

  return (
    <Section>
      <Heading size="xl">Emails</Heading>
      <EmailForm onSubmit={update} initialValues={data.email} submitLabel="Edit Email" />

      <Button
        size="large"
        level="secondary"
        confirmation={`Really delete ${data.email.name}?`}
        onClick={remove}
      >
        Delete Email
      </Button>
    </Section>
  );
};

export default AdminEditEmail;
