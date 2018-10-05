import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { compose, setDisplayName } from "recompose";
import { Link } from "react-router";
import { reduxForm } from "redux-form";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

//
// gql
import { email } from "fragments";
import { waitForData } from "enhancers";

//
// components
import {
  Btn,
  DataTable,
} from "components/uikit";
import EmailForm, { validate } from "components/admin/Emails.Form";
import EmailTemplate from "./EmailTemplate";

export class AdminEmails extends Component {

  createEmail = (email) => {
    const { createEmail, data, reset } = this.props;

    return createEmail({ variables: { email } })
    .then(() => {
      data.refetch();
      reset();

      return true;
    });
  }

  deleteEmail = (email) => {
    const { deleteEmail, data } = this.props;

    return deleteEmail({ variables: { id: email.id } })
    .then(() => data.refetch());
  }

  renderActions = (selected) => {
    return (
      <Fragment>
        <Btn
          className="icon icon--small icon--delete"
          confirmation={`Really delete ${selected.length} emails?`}
          onClick={() => selected.forEach(this.deleteEmail)}
        >
          Delete {selected.length} emails
        </Btn>
      </Fragment>
    );
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const emails = this.props.data.emails.edges.map(e => e.node);
    const { handleSubmit, submitting, submitSucceeded, formValues } = this.props;

    return (
      <div className="admin--container admin--emails">
        <DataTable
          source={emails}
          labels={[ "Name" , "Subject", "Title" ]}
          search={[ "name" , "subject", "title" ]}
          sorter={[ "name" , "subject", "title" ]}
          actions={this.renderActions}
          render={(email, select) => (
            <tr key={email.id}>
              {select}
              <td><Link to={`/admin/emails/${email.id}`}>{email.name}</Link></td>
              <td><Link to={`/admin/emails/${email.id}`}>{email.subject}</Link></td>
              <td><Link to={`/admin/emails/${email.id}`}>{email.title}</Link></td>
            </tr>
          )}
        />

        <div className="admin--emails--new">
          <div>
            <h3>Create new Email</h3>

            <EmailForm
              {...{ handleSubmit, submitting, submitSucceeded }}
              buttonLabel="Create Email"
              form="newEmail"
              save={this.createEmail}
            />
          </div>

          <div className="preview">
            <EmailTemplate email={formValues}/>
          </div>
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("AdminEmails"),

  reduxForm({
    form: "newEmail",
    validate,
  }),

  connect(state => ({
    formValues: state.form.newEmail.values || {},
  })),

  graphql(gql`{
    emails(first: 1000) { edges { node { ...email } } }
  } ${email}`),

  graphql(
    gql`mutation deleteEmail($id: String!) {
      deleteEmail(id: $id) { id }
    }`,
    { name: "deleteEmail" }
  ),

  graphql(
    gql`mutation createEmail($email: EmailInput!) {
      createEmail(email: $email) { ...email }
    } ${email}`,
    { name: "createEmail" }
  ),

  graphql(
    gql`mutation updateEmail($id: String!, $email: EmailInput!) {
      updateEmail(id: $id, email: $email) { ...email }
    } ${email}`,
    { name: "updateEmail" }
  ),

  waitForData,
)(AdminEmails);
