import "./styles";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, getContext } from "recompose";
import { Link } from "react-router";
import { connect } from "react-redux";
import { includes, map } from "lodash";
import { reduxForm, Field } from "redux-form";

//
// Components
import { Modal, Button, ErrorMessage } from "uikit";
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

//
// validation
import { composeValidators, validatePresence } from "validators";

const validate = (values) => {
  return composeValidators(
    validatePresence("id_number", "ID Number (BI)"),
  )(values);
};

export class Dashboard extends Component {

  state = {
    openModal: openWorkshop(),
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
  openModal = (slug) => {
    this.setState({ openModal: slug });
    window.location.hash = `#workshop-${slug}`;
  }

  closeModal = () => {
    this.setState({ openModal: null });
    this.props.router.push(window.location.pathname);
  }

  openParticipationCertificate = () => {
    const { valid, formValues } = this.props;

    valid && window.open(`/participation-certificate?id_number=${formValues.id_number}`);
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
    this.setState({ openModal: openWorkshop() });
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { currentUser, currentUser: { team }, workshops, handleSubmit } = this.props;
    const { openModal, teamDisclaimer, applying, slackError } = this.state;

    const isParticipating = (team && team.applied) || currentUser.workshops.length > 0;

    return (
      <div className="Dashboard">
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

                  <label className="checkbox">
                    <span className="required">*</span>
                    <input type="checkbox" id="teamDisclaimer" name="teamDisclaimer" checked={teamDisclaimer} onChange={e => this.setState({ teamDisclaimer: e.target.checked })} />
                    <span>We ({map(team.members, "display_name").join(", ")}) are committing to attend the Make or Break hackathon and will do everything in our power to do so</span>
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
                  onClick={() => this.openModal(workshop.slug)}
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
                form
                centered
                disabled={slackError !== null}
                onClick={this.sendSlackInvite}
              >
                Send invite to {currentUser.email}
              </Button>
              <p className="small-notice">{slackError}</p>
            </div>

            {isParticipating &&
              <div>
                <hr />
                <h2>Certificate of participation</h2>

                <form onSubmit={handleSubmit(this.openParticipationCertificate)}>

                  <Field id="id_number" name="id_number" component="input" type="text" placeholder="ID Number (BI)" className="fullwidth" />
                  <ErrorMessage form="participation-certificate" field="id_number" />

                  <Button
                    type="submit"
                    primary
                    fullwidth
                    form
                    centered
                    onClick={this.openParticipationCertificate}
                  >
                    Get your certificate
                  </Button>
                </form>
              </div>
            }

          </Panel>
        </Tabs>

        {map(workshops, workshop => (
          <Modal
            key={workshop.slug}
            isOpen={openModal === workshop.slug}
            title={workshop.name}
            onRequestClose={this.closeModal}
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
  setDisplayName("Dashboard"),

  getContext({
    router: PropTypes.object.isRequired,
  }),

  reduxForm({
    form: "participation-certificate",
    validate,
  }),

  connect(({ currentUser, workshops, form }) => ({
    currentUser,
    workshops,
    formValues: form["participation-certificate"].values || {},
  })),
)(Dashboard);
