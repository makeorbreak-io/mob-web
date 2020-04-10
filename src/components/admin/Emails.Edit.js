/* eslint-disable */

import React, { Component } from "react";
// import { compose, setDisplayName, withProps } from "recompose";
// import { graphql } from "react-apollo";
// import { reduxForm } from "redux-form";
// import { connect } from "react-redux";
import { useQuery } from "@apollo/react-hooks";
import { omit } from "lodash";
import gql from "graphql-tag";

//
// gql

import { email } from "fragments";
// import { waitForData } from "enhancers";

//
// components
// import {
//   Btn,
// } from "components/uikit";
import EmailForm, { validate } from "components/admin/Emails.Form";
import EmailTemplate from "./EmailTemplate";

// const ADMIN_EMAIL = gql`
// `;

export class AdminEditEmail extends Component {

  updateEmail = (email) => {
    const { updateEmail } = this.props;

    return updateEmail({ variables: { email, id: this.props.params.id }});
  }
  // createEmail = (email) => {
  //   const { createEmail, data, reset } = this.props;

  //   return createEmail({ variables: { email } })
  //     .then(() => {
  //       data.refetch();
  //       reset();

  //       return true;
  //     });
  // }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    return null;
    // const { handleSubmit, submitting, submitSucceeded, formValues } = this.props;

    // return (
    //   <div className="admin--container admin--emails">
    //     <div className="admin--emails--new">
    //       <div>
    //         <h3>Create new Email</h3>

    //         <EmailForm
    //           {...{ handleSubmit, submitting, submitSucceeded }}
    //           buttonLabel="Update Email"
    //           form="updateEmail"
    //           save={this.updateEmail}
    //         />
    //       </div>

    //       <div className="preview">
    //         <EmailTemplate email={formValues} />
    //       </div>
    //     </div>
    //   </div>
    // );
  }

}

// export default compose(
  // setDisplayName("AdminEditEmail"),

  // graphql(gql`query email($id: String!) {
  //   email(id: $id) { ...email }
  // } ${email}`,
  // {
  //   options: (props) => ({ variables: { id: props.params.id }}),
  // }),

  // waitForData,

  // withProps(
  //   (props) => ({ initialValues: omit(props.data.email, ["__typename", "id"]) })
  // ),

  // reduxForm({
  //   form: "updateEmail",
  //   validate,
  // }),

  // connect(state => ({
  //   formValues: state.form.updateEmail.values || {},
  // })),

  // graphql(
  //   gql`mutation updateEmail($id: String!, $email: EmailInput!) {
  //     updateEmail(id: $id, email: $email) { ...email }
  //   } ${email}`,
  //   { name: "updateEmail" }
  // ),
// )(AdminEditEmail);
export default AdminEditEmail;

/* eslint-enable */
