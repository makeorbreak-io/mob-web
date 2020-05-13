import React, { useState, useEffect } from "react";
import { compose } from "recompose";
import { useHistory } from "react-router-dom";
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

import {
  Heading,
} from "components/2020/uikit";

export const UserOnboardingPrivacy = ({
  data: { me },
  updateMe,
}) => {
  const [dataUsageConsent, setDataUsageConsent] = useState(me.dataUsageConsent);
  const [spamConsent, setSpamConsent] = useState(me.spamConsent);
  const [shareConsent, setShareConsent] = useState(me.shareConsent);

  const history = useHistory();

  useEffect(() => localStorage.setItem("checked-privacy", "true"));

  const updatePrivacyPreferences = () => (
    updateMe({ variables: { user: { dataUsageConsent, spamConsent, shareConsent } }})
      .then(() => history.push("/dashboard"))
  );

  return (
    <div className="UserOnboarding privacy">
      <Heading size="l" centered>Privacy and personal data</Heading>

      <Heading size="m">Personal data we store</Heading>
      <ul>
        <li>Name</li>
        <li>Email</li>
        <li>T-shirt size</li>
        <li>GitHub username</li>
      </ul>

      <Heading size="m">How we use your data during the main event</Heading>
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
            onChange={(dataUsageConsent) => setDataUsageConsent(dataUsageConsent)}
          />
        </li>
      </ul>

      <Heading size="m">How we use your data to communicate with you</Heading>
      <ul>
        <li>We use your name and email to send you email updates related to Make or Break, its main event, satellite events (like MoB Sessions), or other information we might consider relevant to the Make or Break community.</li>
      </ul>
      <ul className="settings">
        <li>
          <span>You give us permission to your data to communicate with you</span>
          <BinaryToggle
            options={binaryToggleOptions}
            defaultSelected={spamConsent ? 1 : 0}
            onChange={(spamConsent) => setSpamConsent(spamConsent)}
          />
        </li>
      </ul>

      <Heading size="m">How we share your data with our sponsors or partners</Heading>
      <ul>
        <li>We share your name and email with our sponsors or partners so they can get involved with the Make or Break community, by informing you about opportunities (like job offers) or important updates related to their company, institution, or core business;</li>
      </ul>
      <ul className="settings">
        <li>
          <span>You give us permission to share your personal data with our sponsors or partners</span>
          <BinaryToggle
            options={binaryToggleOptions}
            defaultSelected={shareConsent ? 1 : 0}
            onChange={(shareConsent) => setShareConsent(shareConsent)}
          />
        </li>
      </ul>

      <Button level="primary" onClick={updatePrivacyPreferences}>
        Save privacy settings
      </Button>
    </div>
  );
};

export default compose(
  withCurrentUser,
  waitForData,

  graphql(
    gql`mutation updateMe($user: UserInput!) {
      updateMe(user: $user) { ...fullUser }
    } ${fullUser}`,
    { name: "updateMe" },
  ),
)(UserOnboardingPrivacy);
