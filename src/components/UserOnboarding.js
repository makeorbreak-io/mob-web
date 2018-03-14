import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";

//
// Components
import { Tabs, Tab, Panel } from "components/uikit/tabs";
import Name from "./UserOnboarding.Name";
import Team from "./UserOnboarding.Team";
import Invites from "./UserOnboarding.Invites";

//
// Enhancers
import multistep from "enhancers/multistep";

export class UserOnboarding extends Component {

  componentWillMount() {
    this.props.initFlow();
  }

  render() {
    const { next, currentStep } = this.props;

    return (
      <div className="UserOnboarding">
        <div className="content white">
          <Tabs green small showIndex selected={currentStep}>
            <Tab><span>Your Information</span></Tab>
            <Tab><span>Create Your Team</span></Tab>
            <Tab><span>Invite Team Members</span></Tab>

            <Panel><Name next={next} /></Panel>
            <Panel><Team next={next}/></Panel>
            <Panel><Invites next={next} /></Panel>
          </Tabs>
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("UserOnboarding"),

  multistep({
    name: "user-onboarding",
    steps: 3,
  }),
)(UserOnboarding);
