import React, { useCallback } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";

//
// gql
import { ADMIN_EMAILS } from "queries";
import {
  ADMIN_CREATE_EMAIL,
  // ADMIN_UPDATE_EMAIL,
  ADMIN_DELETE_EMAIL,
} from "mutations";

//
// components
import { DataTable } from "components/uikit";

import {
  Button,
  Heading,
  Section,
  Link,
} from "components/2020/uikit";

import EmailForm from "components/admin/Emails.Form";

export const AdminEmails = () => {
  const { loading, data, refetch } = useQuery(ADMIN_EMAILS);

  const [createEmail] = useMutation(ADMIN_CREATE_EMAIL);
  const [deleteEmail] = useMutation(ADMIN_DELETE_EMAIL);

  const create = useCallback((email) => {
    createEmail({ variables: { email } })
      .then(() => refetch());
  }, []);

  const renderActions = (selected) => (
     <Button
       size="small"
       level="secondary"
       // className="icon icon--small icon--delete"
       confirmation={`Really delete ${selected.length} emails?`}
       onClick={() => Promise.all(selected.map(({ id }) => deleteEmail({ variables: { id } }))).then(refetch)}
     >
      Delete {selected.length} emails
     </Button>
  );

  if (loading) return "Loading...";

  return (
    <Section>
      <Heading size="xl">Emails</Heading>

      <DataTable
        source={data.emails}
        labels={[ "Identifier" , "Subject" , "Title" ]}
        search={[ "name"       , "subject" , "title" ]}
        sorter={[ "name"       , "subject" , "title" ]}
        actions={renderActions}
        render={(email, select) => (
          <tr key={email.id}>
            {select}
            <td><Link to={`/admin/emails/${email.id}`}>{email.name}</Link></td>
            <td><Link to={`/admin/emails/${email.id}`}>{email.subject}</Link></td>
            <td><Link to={`/admin/emails/${email.id}`}>{email.title}</Link></td>
          </tr>
        )}
      />

      <EmailForm submitLabel="Create Email" onSubmit={create} />

    </Section>
  );
};

export default AdminEmails;
