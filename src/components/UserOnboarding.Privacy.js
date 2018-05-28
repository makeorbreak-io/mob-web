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
  BinaryToggle,
} from "components/uikit";


export class UserOnboardingPrivacy extends Component {

  state = {
    dataUsageConsent: this.props.data.me.dataUsageConsent,
    spamConsent: this.props.data.me.spamConsent,
    shareConsent: this.props.data.me.shareConsent,
  }

  componentDidMount() {
    localStorage.setItem("checked-privacy", "true");
  }

  updateMe = () => {
    const { updateMe, router } = this.props;
    const { dataUsageConsent, spamConsent, shareConsent } = this.state;

    return updateMe({
      variables: { user: { dataUsageConsent, spamConsent, shareConsent } },
    })
    .then(() => router.push("/dashboard"));
  }

  render() {
    const { dataUsageConsent, spamConsent, shareConsent } = this.state;

    return (
      <div className="UserOnboarding privacy">
        <h1>Your privacy and personal data</h1>

        <h2>Personal data we store</h2>
        <ul>
          <li>Name</li>
          <li>Email</li>
          <li>T-shirt size</li>
          <li>GitHub username</li>
        </ul>

        <h2>How we use your data during the main event</h2>
        <ul>
          <li>We use your name to create a credential to identify you;</li>
          <li>We use your t-shirt size to estimate the size distribution of the t-shirts given to participants;</li>
          <li>We use your GitHub username to give you access to a Make or Break repository in the GitHub platform, so that you can participate in the Make or Break hackathon during our main event.</li>
        </ul>
        <ul className="settings">
          <li>
            <span>You give us permission to use your data during the main event</span>
            <BinaryToggle
              options={binaryToggleOptions}
              defaultSelected={dataUsageConsent ? 1 : 0}
              onChange={dataUsageConsent => this.setState({ dataUsageConsent })}
            />
          </li>
        </ul>

        <h2>How we use your data to communicate with you</h2>
        <ul>
          <li>We use your name and email to send you email updates related to Make or Break, its main event, satellite events (like MoB Sessions), or other information we might consider relevant to the Make or Break community.</li>
        </ul>
        <ul className="settings">
          <li>
            <span>You give us permission to your data to communicate with you</span>
            <BinaryToggle
              options={binaryToggleOptions}
              defaultSelected={spamConsent ? 1 : 0}
              onChange={spamConsent => this.setState({ spamConsent })}
            />
          </li>
        </ul>

        <h2>How we share your data with our sponsors or partners</h2>
        <ul>
          <li>We share your name and email with our sponsors or partners so they can get involved with the Make or Break community, by informing you about opportunities (like job offers) or important updates related to their company, institution, or core business;</li>
        </ul>
        <ul className="settings">
          <li>
            <span>You give us permission to share your personal data with our sponsors or partners</span>
            <BinaryToggle
              options={binaryToggleOptions}
              defaultSelected={shareConsent ? 1 : 0}
              onChange={shareConsent => this.setState({ shareConsent })}
            />
          </li>
        </ul>

        <Button primary centered form onClick={this.updateMe}>
          Save privacy settings
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
