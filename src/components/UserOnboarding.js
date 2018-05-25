import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";

import { withCurrentUser, waitForData, multistep } from "enhancers";

import { Tabs, Tab, Panel } from "components/uikit/tabs";
import Name from "./UserOnboarding.Name";
import Team from "./UserOnboarding.Team";
import Privacy from "./UserOnboarding.Privacy";

export class UserOnboarding extends Component {

  state = {
    hackathonParticipant: this.props.data.me.currentTeam ? true : false,
  }

  componentWillMount() {
    const { setSteps, data: { me } } = this.props;

    setSteps(me.currentTeam ? 3 : 2);
    // this.setState({ hackathonParticipant: me.currentTeam ? true : false });
  }

  setHackathonParticipant = (value) => {
    const { setSteps, steps } = this.props;
    this.setState({ hackathonParticipant: value });

    setSteps(value ? steps + 1 : steps - 1);
  }

  render() {
    const { hackathonParticipant } = this.state;
    const { next, currentStep, data: { me } } = this.props;

    return (
      <div className="UserOnboarding">
        <div className="content white">
          <Tabs green small showIndex selected={currentStep}>
            <Tab><span>Your Information</span></Tab>
            {hackathonParticipant &&
              <Tab><span>{me.currentTeam ? "Update" : "Create"} Your Team</span></Tab>
            }
            <Tab><span>Your privacy</span></Tab>

            <Panel>
              <Name
                next={next}
                setHackathonParticipant={this.setHackathonParticipant}
              />
            </Panel>
            {hackathonParticipant && <Panel><Team /></Panel>}
            <Panel><Privacy /></Panel>
          </Tabs>
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("UserOnboarding"),

  withCurrentUser,
  waitForData,

  multistep({
    name: "user-onboarding",
  }),
)(UserOnboarding);
