import React, { useState, useEffect } from "react";
import { compose, setDisplayName } from "recompose";

import {  multistep } from "enhancers";

import { useCurrentUser } from "hooks";

import { Tabs, Tab, Panel } from "components/uikit/tabs";
import { Section } from "components/2020/uikit";

import Name from "./UserOnboarding.Name";
import Team from "./UserOnboarding.Team";
import Privacy from "./UserOnboarding.Privacy";

const UserOnboarding = ({
  currentStep,
  next,
  setSteps,
}) => {
  const { loading, data } = useCurrentUser();

  if (loading) return null;

  const [hackathonParticipant, setHackathonParticipant] = useState(data.me.currentTeam ? true : false);

  useEffect(() => {
    setSteps(hackathonParticipant ? 3 : 2);
  }, [hackathonParticipant]);

  return (
    <Section id="user-onboarding">
      <Tabs green small showIndex selected={currentStep}>
        <Tab><span>Your Information</span></Tab>

        {hackathonParticipant &&
          <Tab><span>{data.me.currentTeam ? "Update" : "Create"} Your Team</span></Tab>
        }

        <Tab><span>Your privacy</span></Tab>

        <Panel>
          <Name
            next={next}
            setHackathonParticipant={setHackathonParticipant}
          />
        </Panel>

        {hackathonParticipant && <Panel><Team /></Panel>}

        <Panel><Privacy /></Panel>
      </Tabs>
    </Section>
  );
};

// export class UserOnboardingComponent extends Component {
//
//   state = {
//     hackathonParticipant: this.props.data.me.currentTeam ? true : false,
//   }
//
//   componentWillMount() {
//     const { setSteps, data: { me } } = this.props;
//
//     setSteps(me.currentTeam ? 3 : 2);
//     // this.setState({ hackathonParticipant: me.currentTeam ? true : false });
//   }
//
//   setHackathonParticipant = (value) => {
//     const { setSteps, steps } = this.props;
//     this.setState({ hackathonParticipant: value });
//
//     setSteps(value ? steps + 1 : steps - 1);
//   }
//
//   render() {
//     const { hackathonParticipant } = this.state;
//     const { next, currentStep, data: { me } } = this.props;
//
//     return (
//       <div className="UserOnboarding">
//         <div className="content white">
//           <Tabs green small showIndex selected={currentStep}>
//             <Tab><span>Your Information</span></Tab>
//             {hackathonParticipant &&
//               <Tab><span>{me.currentTeam ? "Update" : "Create"} Your Team</span></Tab>
//             }
//             <Tab><span>Your privacy</span></Tab>
//
//             <Panel>
//               <Name
//                 next={next}
//                 setHackathonParticipant={this.setHackathonParticipant}
//               />
//             </Panel>
//             {hackathonParticipant && <Panel><Team /></Panel>}
//             <Panel><Privacy /></Panel>
//           </Tabs>
//         </div>
//       </div>
//     );
//   }
//
// }

export default compose(
  setDisplayName("UserOnboarding"),

  multistep({
    name: "user-onboarding",
  }),
)(UserOnboarding);
