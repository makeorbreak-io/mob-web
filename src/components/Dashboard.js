import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { withRouter } from "react-router";
// import { map } from "lodash";
import { connect } from "react-redux";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

//
// Enhancers
import { waitForData } from "enhancers";

import { fullTeam, fullUser, workshop } from "fragments";

import { handleGraphQLErrors } from "lib/graphql";

//
// Components
// import NotificationCenter from "components/NotificationCenter";
// import Team from "components/Team";
// import { Button } from "components/uikit";

//
// api actions
import {
  // Button,
  Heading,
  Link,
  // P,
  Section,
  // Tag,
} from "components/2020/uikit";

import { getInviteToSlack } from "api/slack";

export class Dashboard extends Component {

  state = {
    applying: false,
    teamDisclaimer: false,
    slackError: null,
    selectedWorkshop: null,
  }

  //----------------------------------------------------------------------------
  // Event handlers
  //----------------------------------------------------------------------------
  applyTeam = (ev) => {
    ev.preventDefault();

    const { data, data: { me }, updateTeam } = this.props;

    this.setState({ applying: true });

    return updateTeam({
      variables: { id: me.currentTeam.id, team: { name: me.currentTeam.name, applied: true } },
    })
    .then(() => data.refetch())
    .then(() => this.setState({ applying: false }))
    .catch(handleGraphQLErrors);
  }

  sendSlackInvite = () => {
    const { data: { me } } = this.props;

    getInviteToSlack(me.email)
    .catch(_ => this.setState({ slackError: `${me.email} is already invited / in team` }));
  }

  setSelectedWorkshop = (selectedWorkshop) => this.setState({ selectedWorkshop });

  deleteAccount = () => {
    const { data, deleteAccount } = this.props;

    deleteAccount()
    .then(() => {
      delete localStorage["jwt"];
      data.refetch();
    });
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { data: { me } } = this.props;
    // const { data: { me }, notifications } = this.props;
    // const team = me.currentTeam;

    // const { teamDisclaimer, applying, slackError } = this.state;

    return (
      <Section center>
        <Heading size="xl" centered>Hello {me.displayName}!</Heading>

        <Heading size="l" color="red">Under construction</Heading>

        <Link to="/profile">Edit profile</Link>
      </Section>
    );

    // return (
    //   <div className="dashboard">
    //     {notifications.length > 0 &&
    //       <Fragment>
    //         <h2>Notifications <span className="tag red">{notifications.length}</span></h2>
    //         <NotificationCenter />
    //         <hr />
    //       </Fragment>
    //     }

    //     <Team editable id={team && team.id} />

    //     <div className="team">
    //       {team && team.applied && !team.accepted && <h3>Your team's application to the hackathon is under review</h3>}
    //       {team && team.accepted && <h3>Your team is in the hackathon!</h3>}

    //       {team && !team.applied &&
    //         <form onSubmit={this.applyTeam}>
    //           <label className="checkbox">
    //             <span className="required">*</span>
    //             <input type="checkbox" id="teamDisclaimer" name="teamDisclaimer" checked={teamDisclaimer} onChange={e => this.setState({ teamDisclaimer: e.target.checked })} />
    //             <span>We ({map(team.memberships, "user.displayName").join(", ")}) are committing to attend the Make or Break hackathon and will do everything in our power to do so</span>
    //           </label>

    //           <Button
    //             type="submit"
    //             primary
    //             form
    //             centered
    //             disabled={applying || !teamDisclaimer || team.memberships.length <= 1}
    //           >
    //             Apply to hackathon
    //           </Button>
    //           {team.memberships.length <= 1 &&
    //             <p className="small-notice">You can't apply alone. Invite some friends, or find a team in our Slack community!</p>
    //           }
    //         </form>
    //       }
    //     </div>

    //     <hr />

    //     <h2 className="with-actions">
    //       <div className="title">Hackathon project </div>
    //       <div className="actions">
    //         <Link to="/project/edit">
    //           <Button primary small>Edit Project</Button>
    //         </Link>
    //       </div>
    //     </h2>

    //     <hr />

    //     <h2>Community</h2>
    //     <h3>Hey! Listen!</h3>
    //     <p>
    //       You can't participate in the Make or Break hackathon <a href="https://github.com/makeorbreak-io/rules#participation" target="_blank" rel="noreferrer noopener">by yourself.</a>
    //       <br />
    //       Join our <a href="https://makeorbreak-io.slack.com/" target="_blank" rel="noopener noreferrer">Slack community</a> and form a team with other participants.
    //     </p>

    //     <div className="slack">
    //       <Button
    //         primary
    //         form
    //         centered
    //         disabled={slackError !== null}
    //         onClick={this.sendSlackInvite}
    //         apply
    //       >
    //         Send invite to {me.email}
    //       </Button>
    //       <p className="small-notice">{slackError}</p>
    //     </div>

    //     <hr />

    //     <div className="danger-zone">
    //       <h2>Delete your account</h2>

    //       <Button
    //         danger
    //         confirmation="Really delete your account? You will not be able to recover any of your existing data."
    //         onClick={this.deleteAccount}
    //       >
    //         Delete account
    //       </Button>
    //     </div>

    //   </div>
    // );
  }

}

export default compose(
  setDisplayName("Dashboard"),

  withRouter,

  graphql(gql`{
    me { ...fullUser }
    workshops { ...workshop }
    # infoStart
    # infoEnd
  } ${fullUser} ${workshop}`),

  waitForData,

  graphql(
    gql`mutation updateTeam($id: String!, $team: TeamInput!) {
      updateTeam(id: $id, team: $team) { ...fullTeam }
    } ${fullTeam}`,
    { name: "updateTeam" },
  ),

  graphql(
    gql`mutation deleteAccount {
      deleteAccount { id }
    }`,
    { name: "deleteAccount" },
  ),

  connect(({ notifications }) => ({ notifications })),
)(Dashboard);
