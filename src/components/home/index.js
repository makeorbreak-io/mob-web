import "./styles";
import "./styles.responsive";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { compose, setDisplayName, getContext } from "recompose";
import { connect } from "react-redux";
import { includes, map } from "lodash";

//
// Components
import Landing from "components/landing";
import { Modal, Button } from "uikit";
import { Tabs, Tab, Panel } from "uikit/tabs";
import Workshop from "components/workshop";

//
// redux
import { fetchWorkshops } from "actions/workshops";
import { updateTeam } from "actions/teams";
import { refreshCurrentUser } from "actions/current_user";

//
// api actions
import { getInviteToSlack } from "api/slack";

//
// utils
import { sortedWorkshops, openWorkshop } from "util/workshops";

export class Home extends Component {

  state = {
    openWorkshop: openWorkshop(),
    applying: false,
    teamDisclaimer: false,
    slackError: null,
  }

  //----------------------------------------------------------------------------
  // Lifecycle
  //----------------------------------------------------------------------------
  componentDidMount() {
    this.props.dispatch(fetchWorkshops());

    window.addEventListener("hashchange", this.handleHashChange);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.handleHashChange);
  }

  //----------------------------------------------------------------------------
  // Event handlers
  //----------------------------------------------------------------------------
  openWorkshop = (slug) => {
    this.setState({ openWorkshop: slug });
    window.location.hash = `#workshop-${slug}`;
  }

  closeWorkshop = () => {
    this.setState({ openWorkshop: null });
    // this.props.router.push(window.location.href.split('#')[0]);
    this.props.router.push(window.location.pathname);
  }

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

  handleHashChange = () => {
    this.setState({ openWorkshop: openWorkshop() });
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { currentUser, workshops } = this.props;
    const { openWorkshop, teamDisclaimer, applying, slackError } = this.state;

    if (!currentUser) return <Landing />;

    const { team } = currentUser;

    return (
      <div className="Home">
        <Tabs>
          <Tab><span>Dashboard</span></Tab>

          <Panel>
            <h2><Link to="/profile">Profile</Link></h2>

            <dl className="clearfix">
              <dt>Name</dt>
              <dd>{currentUser.display_name}</dd>

              <dt>Email</dt>
              <dd>{currentUser.email}</dd>

              <dt>T-Shirt size</dt>
              <dd>
                {
                  currentUser.tshirt_size ||
                  <span className="warning">T-shirt size not set!<br />We'll assume your size is L.</span>
                }
              </dd>
            </dl>

            <hr />
            <h2><Link to="/account/team">Team {team && `- ${team.name}`}</Link></h2>
            <div className="team">
              {team && team.applied && <h3>Your team is confirmed for the hackathon!</h3>}
              {team && !team.applied &&
                <form onSubmit={this.applyTeam}>
                  <h3>Your team is not yet confirmed for the hackathon</h3>

                  <label>
                    <span className="required">*</span>
                    <input type="checkbox" id="teamDisclaimer" name="teamDisclaimer" checked={teamDisclaimer} onChange={e => this.setState({ teamDisclaimer: e.target.checked })} />
                    We ({map(team.members, "display_name").join(", ")}) are committing to attend the Make or Break hackathon and will do everything in our power to do so
                  </label>

                  <Button
                    type="submit"
                    primary
                    fullwidth
                    form
                    disabled={applying || !teamDisclaimer || team.members.length <= 1}
                  >
                    Confirm presence in hackathon
                  </Button>
                  {team.members.length <= 1 &&
                    <p className="small-notice">You can't apply alone. Invite some friends, or find a team in our Slack community!</p>
                  }
                </form>
              }
              {!team &&
                <p>
                  You are not a part of a team yet!
                  <br />
                  <Link to="/account/team">Create one</Link> or request an invite from one of your friends.
                </p>
              }
            </div>

            <hr />
            <h2>Workshops</h2>
            <ul className="workshops">
              {sortedWorkshops(workshops).map(workshop => (
                <li
                  className="workshop"
                  key={workshop.slug}
                  onClick={() => this.openWorkshop(workshop.slug)}
                >
                  {workshop.name}
                  {includes(map(currentUser.workshops, "slug"), workshop.slug) &&
                    <span className="attending-badge">You're in!</span>
                  }
                </li>
              ))}
            </ul>

            <hr />
            <h2>Slack</h2>
            <h3>Join the <a href="https://portosummerofcode.slack.com/" target="_blank" rel="noopener noreferrer">PSC Slack community!</a></h3>
            <div className="slack">
              <Button
                primary
                fullwidth
                disabled={slackError !== null}
                onClick={this.sendSlackInvite}
              >
                Send invite to {currentUser.email}
              </Button>
              <p className="small-notice">{slackError}</p>
            </div>

          </Panel>
        </Tabs>

        {map(workshops, workshop => (
          <Modal
            key={workshop.slug}
            isOpen={openWorkshop === workshop.slug}
            title={workshop.name}
            onRequestClose={this.closeWorkshop}
          >
            <Workshop
              workshop={workshop}
              showSummary
              showDescription
              showSpeaker
            />
          </Modal>
        ))}
      </div>
    );
  }

}

export default compose(
  setDisplayName("Home"),

  getContext({
    router: PropTypes.object.isRequired,
  }),

  connect(({ currentUser, workshops }) => ({ currentUser, workshops })),
)(Home);
