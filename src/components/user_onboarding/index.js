import "./styles";
import "./styles.responsive";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";

//
// Components
import { Tabs, Tab, Panel } from "uikit/tabs";
import Name from "./name";
import Team from "./team";
import Invites from "./invites";

//
// Redux
import { fetchUsers } from "actions/users";

//
// Enhancers
import multistep from "enhancers/multistep";

export class UserOnboarding extends Component {

  componentWillMount() {
    const { dispatch, initFlow } = this.props;

    dispatch(fetchUsers());
    initFlow();
  }

  render() {
    const { next, currentStep } = this.props;

    return (
      <div className="UserOnboarding">
        <Tabs green small showIndex selected={currentStep}>
          <Tab><span>Your Information</span></Tab>
          <Tab><span>Create Your Team</span></Tab>
          <Tab><span>Invite Team Members</span></Tab>

          <Panel><Name next={next} /></Panel>
          <Panel><Team next={next}/></Panel>
          <Panel><Invites next={next} /></Panel>
        </Tabs>
      </div>
    );
  }

}

export default compose(
  setDisplayName("UserOnboarding"),

  connect(),

  multistep({
    name: "user-onboarding",
    steps: 3,
  }),
)(UserOnboarding);
