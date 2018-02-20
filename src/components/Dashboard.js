import React, { Component, Fragment } from "react";
import { compose, setDisplayName } from "recompose";
import { Link, withRouter } from "react-router";
import { map } from "lodash";
import { connect } from "react-redux";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

//
// Enhancers
import { withCurrentUser, waitForData } from "enhancers";

import { fullTeam } from "fragments";

import { handleGraphQLErrors } from "lib/graphql";

//
// Components
import NotificationCenter from "components/NotificationCenter";
import Team from "components/Team";
import { Button } from "components/uikit";

//
// api actions
import { getInviteToSlack } from "api/slack";

export class Dashboard extends Component {

  state = {
    applying: false,
    teamDisclaimer: false,
    slackError: null,
  }

  //----------------------------------------------------------------------------
  // Event handlers
  //----------------------------------------------------------------------------
  applyTeam = (ev) => {
    ev.preventDefault();

    const { data, updateTeam, data: { me: { teams } } } = this.props;
    const team = teams[0];

    this.setState({ applying: true });

    return updateTeam({
      variables: { id: team.id, team: { name: team.name, applied: true } },
    })
    .then(() => data.refetch())
    .then(() => this.setState({ applying: false }))
    .catch(handleGraphQLErrors);
  }

  sendSlackInvite = () => {
    const { currentUser: { email } } = this.props;

    getInviteToSlack(email)
    .catch(e => this.setState({ slackError: `${email} ${e.errors.email}`}));
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { data: { me }, notifications } = this.props;
    const team = me.teams[0];

    const { teamDisclaimer, applying, slackError } = this.state;

    return (
      <div className="Dashboard">
        {notifications.length > 0 &&
          <Fragment>
            <h2>Notifications <span className="tag red">{notifications.length}</span></h2>
            <NotificationCenter />
            <hr />
          </Fragment>
        }

        <Team editable id={team && team.id} />
        <div className="team">
          {team && team.applied && <h3>Your team's application to the hackathon is under review</h3>}

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
          <div className="title">AI Competition</div>
          <div className="actions">
            <Link to="/ai-competition">
              <Button primary small>Go to AI competition dashboard</Button>
            </Link>
          </div>
        </h2>
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
        <h3>To be announced</h3>
        <p>
          As usual, we will feature a diverse selection of workshops
          <br />
          Stay tuned as we'll announce them in the near future!
        </p>

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

  withCurrentUser,
  waitForData,

  graphql(
    gql`mutation updateTeam($id: String!, $team: TeamInput!) {
      updateTeam(id: $id, team: $team) { ...fullTeam }
    } ${fullTeam}`,
    { name: "updateTeam" },
  ),

  connect(({ notifications }) => ({ notifications })),
)(Dashboard);
