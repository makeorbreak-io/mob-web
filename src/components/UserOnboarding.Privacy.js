import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { withRouter } from "react-router";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { withCurrentUser, waitForData } from "enhancers";

import { fullUser } from "fragments";

const binaryToggleOptions = [
  { label: "No", value: false },
  { label: "Yes", value: true },
];

//
// Components
import {
  Button,
  // ErrorMessage,
  BinaryToggle,
} from "components/uikit";


export class UserOnboardingPrivacy extends Component {

  state = {
    dataUsageConsent: this.props.data.me.dataUsageConsent,
  }

  updateMe = () => {
    const { updateMe, data: { me }, router } = this.props;
    const { name, email, tshirtSize } = me;
    const { dataUsageConsent } = this.state;

    return updateMe({
      variables: { user: { name, email, tshirtSize, dataUsageConsent } },
    })
    .then(() => router.push("/dashboard"));
  }

  render() {
    const { dataUsageConsent } = this.state;

    return (
      <div className="UserOnboarding privacy">
        <h1>Your privacy and personal data</h1>

        <h2>Personal data we store</h2>
        <ul>
          <li>Name</li>
          <li>Email</li>
          <li>GitHub username</li>
        </ul>

        <h2>How we use your personal data</h2>
        <ul>
          <li>We use your name and email to send you updates related to Make or Break, its main event, satellite events (like MoB Sessions), or new activities;</li>
          <li>We use your GitHub username to give you access to a Make or Break repository in the GitHub platform, so that you can participate in the Make or Break hackathon during our main event.</li>
        </ul>

        <h2>How we share your personal data</h2>
        <ul>
          <li>We share your name and email with our sponsors or partners so they can get involved with our community, by informing you about opportunities (like job offers) or important updates related to their company, institution, or core business;</li>
          <li>Our sponsors and partners will stop storing your personal data if you ever stop giving permission to its use and sharing.</li>
        </ul>

        <h2>Your privacy settings</h2>
        <ul className="settings">
          <li>
            <span>You give us permission to use and share your personal data</span>
            <BinaryToggle
              options={binaryToggleOptions}
              defaultSelected={dataUsageConsent ? 1 : 0}
              onChange={dataUsageConsent => this.setState({ dataUsageConsent })}
            />
          </li>
        </ul>

        <Button primary centered form onClick={this.updateMe} disabled={!dataUsageConsent}>
          Continue to Dashboard
        </Button>
      </div>
    );
  }
}

export default compose(
  setDisplayName("UserOnboardingPrivacy"),

  withRouter,

  withCurrentUser,
  waitForData,

  graphql(
    gql`mutation updateMe($user: UserInput!) {
      updateMe(user: $user) { ...fullUser }
    } ${fullUser}`,
    { name: "updateMe" },
  ),
)(UserOnboardingPrivacy);
