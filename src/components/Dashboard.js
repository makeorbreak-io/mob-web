import React, { Component, Fragment } from "react";
import { compose, setDisplayName } from "recompose";
import { Link, withRouter } from "react-router";
import { map } from "lodash";
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
import NotificationCenter from "components/NotificationCenter";
import Team from "components/Team";
import Workshop from "components/Workshop";
import { Button, Modal } from "components/uikit";

//
// api actions
import { getInviteToSlack } from "api/slack";

import { sortedWorkshops } from "lib/workshops";
import { download } from "lib/browser";

export class Dashboard extends Component {

  state = {
    applying: false,
    teamDisclaimer: false,
    slackError: null,
    selectedWorkshop: null,
    revealVoterIdentity: false,
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
  revealVoterIdentity = () => this.setState({ revealVoterIdentity: true });

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { data: { me, workshops, infoStart, infoEnd }, notifications } = this.props;
    const team = me.currentTeam;

    const { teamDisclaimer, applying, slackError, selectedWorkshop, revealVoterIdentity } = this.state;
    const currentWorkshop = workshops.find(w => w.slug === selectedWorkshop);

    return (
      <div className="Dashboard">
        {notifications.length > 0 &&
          <Fragment>
            <h2>Notifications <span className="tag red">{notifications.length}</span></h2>
            <NotificationCenter />
            <hr />
          </Fragment>
        }

        <h2>Voting</h2>
        <div className="voting">
          {!revealVoterIdentity && <Button primary small onClick={this.revealVoterIdentity}>Reveal Voter Identity</Button>}
          {revealVoterIdentity && <span>Voter Identity: { me.currentAttendance.voterIdentity }</span>}

          <div>
            <Button primary small onClick={() => download("info_start.json", infoStart)}>Download Voting Info (start)</Button>
            <Button primary small onClick={() => download("info_end.json", infoEnd)}>Download Voting Info (end)</Button>
          </div>
        </div>

        <hr />

        <Team editable id={team && team.id} />
        <div className="team">
          {team && team.applied && !team.accepted && <h3>Your team's application to the hackathon is under review</h3>}
          {team && team.accepted && <h3>Your team is in the hackathon!</h3>}

          {team && !team.applied &&
            <form onSubmit={this.applyTeam}>
              <label className="checkbox">
                <span className="required">*</span>
                <input type="checkbox" id="teamDisclaimer" name="teamDisclaimer" checked={teamDisclaimer} onChange={e => this.setState({ teamDisclaimer: e.target.checked })} />
                <span>We ({map(team.memberships, "user.displayName").join(", ")}) are committing to attend the Make or Break hackathon and will do everything in our power to do so</span>
              </label>

              <Button
                type="submit"
                primary
                form
                centered
                disabled={applying || !teamDisclaimer || team.memberships.length <= 1}
              >
                Apply to hackathon
              </Button>
              {team.memberships.length <= 1 &&
                <p className="small-notice">You can't apply alone. Invite some friends, or find a team in our Slack community!</p>
              }
            </form>
          }
        </div>

        <hr />
        <h2 className="with-actions">
          <div className="title">Hackathon project </div>
          <div className="actions">
            <Link to="/project/edit">
              <Button primary small>Edit Project</Button>
            </Link>
          </div>
        </h2>

        <hr />

        <h2 className="with-actions">
          <div className="title">AI Competition </div>
          <div className="actions">
            <Link to="/ai-competition">
              <Button primary small>Go to AI competition dashboard</Button>
            </Link>
          </div>
        </h2>
        <h3><a href="https://github.com/makeorbreak-io/mob-ai/blob/master/RULES.md" target="_blank" rel="noopener noreferrer">Competition Rules</a></h3>
        {me.currentBot &&
        <p>
          Current bot: {me.currentBot.title} (rev. {me.currentBot.revision}) ({me.currentBot.sdk})
        </p>
        }
        {!me.currentBot &&
        <p>You are currently not participating in the AI competition. If you wish to participate, please submit at least one valid bot in the AI competition dashboard.</p>
        }

        <hr />

        <h2>Workshops</h2>

        <ul className="workshops">
          {sortedWorkshops(workshops).map(workshop => (
            <li key={workshop.slug} className="workshop" onClick={() => this.setSelectedWorkshop(workshop.slug)}>
              <span className="date">{workshop.shortDate}</span>
              <span className="name">{workshop.name}</span>
              {me.workshops.map(w => w.slug).includes(workshop.slug) && <span className="tag orange">You're in!</span> }
            </li>
          ))}
        </ul>

        <Modal
          isOpen={selectedWorkshop !== null}
          title={currentWorkshop && currentWorkshop.name}
          onRequestClose={() => this.setSelectedWorkshop(null)}>
          <Workshop workshop={currentWorkshop} showSummary showDescription showSpeaker />
        </Modal>

        <hr />

        <h2>Community</h2>
        <h3>Hey! Listen!</h3>
        <p>
          You can't participate in the Make or Break hackathon <a href="https://github.com/makeorbreak-io/rules#participation" target="_blank" rel="noreferrer noopener">by yourself.</a>
          <br />
          Join our <a href="https://makeorbreak-io.slack.com/" target="_blank" rel="noopener noreferrer">Slack community</a> and form a team with other participants.
        </p>

        <div className="slack">
          <Button
            primary
            form
            centered
            disabled={slackError !== null}
            onClick={this.sendSlackInvite}
            apply
          >
            Send invite to {me.email}
          </Button>
          <p className="small-notice">{slackError}</p>
        </div>

      </div>
    );
  }

}

export default compose(
  setDisplayName("Dashboard"),

  withRouter,

  graphql(gql`{
    me { ...fullUser }
    workshops { ...workshop }
    infoStart
    infoEnd
  } ${fullUser} ${workshop}`),

  waitForData,

  graphql(
    gql`mutation updateTeam($id: String!, $team: TeamInput!) {
      updateTeam(id: $id, team: $team) { ...fullTeam }
    } ${fullTeam}`,
    { name: "updateTeam" },
  ),

  connect(({ notifications }) => ({ notifications })),
)(Dashboard);
