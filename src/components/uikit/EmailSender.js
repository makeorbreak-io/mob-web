import React, { Component } from "react";
import { arrayOf, object } from "prop-types";
import { compose } from "recompose";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { email } from "fragments";
import { waitForData } from "enhancers";

import { Btn } from "components/uikit";

export class EmailSender extends Component {
  static propTypes = {
    recipients: arrayOf(object).isRequired,
  }

  state = {
    email: "",
  }

  handleEmailChange = (ev) => {
    this.setState({ email: ev.target.value });
  }

  sendEmail = () => {
    const { email } = this.state;
    const { recipients } = this.props;

    return this.props.sendEmail({variables: {
      id: email,
      recipients: recipients.map(r => r.id),
    }})
    .then(() => this.setState({ email: "" }));
  }

  render() {
    const { email } = this.state;
    const { recipients, data: { emails } } = this.props;

    const options = emails.edges.map(e => ({ value: e.node.id, label: e.node.name }));

    return (
      <div className="email--sender">
        <select onChange={this.handleEmailChange}>
          <option value="" disabled selected={!email}>Choose Email...</option>
          {options.map(opt => (
            <option
              key={opt.value}
              value={opt.value}
              selected={opt.value === email}
            >
              {opt.label}
            </option>
          ))}
        </select>

        <Btn
          className="icon icon--email"
          confirmation={`Really send ${(options.find(o => o.value === email) || {}).label} email to ${recipients.length} people?`}
          onClick={this.sendEmail}
          disabled={!email}
          feedbackSuccessLabel={`Sent ${recipients.length} emails`}
          feedbackFailureLabel="Sending failed"
        >
          Send&nbsp;
        </Btn>
      </div>
    );
  }
}

export default compose(
  graphql(gql`{
    emails(first: 1000) { edges { node { ...email } } }
  } ${email}`),

  waitForData,

  graphql(
    gql`mutation sendEmail($id: String!, $recipients: [String]!) {
      sendEmail(id: $id, recipients: $recipients)
    }`,
    { name: "sendEmail" },
  ),
)(EmailSender);
