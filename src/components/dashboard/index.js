import "./styles";
import "./styles.responsive";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, getContext } from "recompose";
import { connect } from "react-redux";
import { map } from "lodash";

//
// Components
import NotificationCenter from "components/notification_center";
import Team from "components/team";
import { Button } from "uikit";

//
// redux
import { updateTeam } from "actions/teams";
import { refreshCurrentUser } from "actions/current_user";

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

    const { dispatch, currentUser: { team } } = this.props;

    this.setState({ applying: true });

    return dispatch(updateTeam(team.id, { applied: true }))
    .finally(() => {
      dispatch(refreshCurrentUser());
      this.setState({ applying: false });
    });
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
    const { currentUser, currentUser: { team }, notifications } = this.props;
    const { teamDisclaimer, applying, slackError } = this.state;

    return (
      <div className="Dashboard">
        {notifications.length > 0 && <h2>Notifications <span className="tag red">{notifications.length}</span></h2>}
        {notifications.length > 0 && <NotificationCenter />}
        {notifications.length > 0 && <hr />}

        <Team editable id={currentUser.team && currentUser.team.id} />
        <div className="team">
          {team && team.applied && <h3>Your team's application to the hackathon is under review</h3>}

          {team && !team.applied &&
            <form onSubmit={this.applyTeam}>
              <label className="checkbox">
                <span className="required">*</span>
                <input type="checkbox" id="teamDisclaimer" name="teamDisclaimer" checked={teamDisclaimer} onChange={e => this.setState({ teamDisclaimer: e.target.checked })} />
                <span>We ({map(team.members, "display_name").join(", ")}) are committing to attend the Make or Break hackathon and will do everything in our power to do so</span>
              </label>

              <Button
                type="submit"
                primary
                form
                centered
                disabled={applying || !teamDisclaimer || team.members.length <= 1}
              >
                Apply to hackathon
              </Button>
              {team.members.length <= 1 &&
                <p className="small-notice">You can't apply alone. Invite some friends, or find a team in our Slack community!</p>
              }
            </form>
          }
        </div>

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
            Send invite to {currentUser.email}
          </Button>
          <p className="small-notice">{slackError}</p>
        </div>

      </div>
    );
  }

}

export default compose(
  setDisplayName("Dashboard"),

  getContext({
    router: PropTypes.object.isRequired,
  }),

  connect(({ currentUser, notifications }) => ({ currentUser, notifications })),
)(Dashboard);
