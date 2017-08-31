import "./styles";
import "./styles.responsive";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { compose, setDisplayName, getContext } from "recompose";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { map, get, isEmpty } from "lodash";
import ReactTooltip from "react-tooltip";

//
// Components
import { Button, Modal, ErrorMessage } from "uikit";
import Workshop from "components/workshop";

//
// redux
import { fetchWorkshops } from "actions/workshops";

//
// api actions
import { getInviteToSlack } from "api/slack";

//
// utils
import { sortedWorkshops, openWorkshop } from "util/workshops";

//
// validation
import { composeValidators, validateEmail, validatePresence } from "validators";

//
// Assets
import landingHackathon from "assets/images/landing-hackathon@2x.jpg";
import landingSchedule from "assets/images/landing-schedule@2x.jpg";
import landingSponsors from "assets/images/landing-sponsors@2x.jpg";

import slackMarkWhite from "assets/images/slack-white.svg";

import SPONSORS from "./sponsors";
import PRIZES from "./prizes";

// validation rules
const validate = (values) => {
  return composeValidators(
    validatePresence("email", "Email address"),
    validateEmail("email", "Email address"),
  )(values);
};

export class Landing extends Component {

  state = {
    openWorkshop: openWorkshop(),
  }

  //----------------------------------------------------------------------------
  // Lifecycle
  //----------------------------------------------------------------------------
  componentDidMount() {
    this.props.dispatch(fetchWorkshops());

    window.addEventListener("hashchange", this.handleHashChange);
    document.querySelector("#app").addEventListener("scroll", this.hideTooltips);

    // scroll to element if hash is used
    const { hash } = window.location;
    if (!isEmpty(hash)) {
      const node = document.querySelector(hash);
      node && node.scrollIntoView();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.handleHashChange);
    document.querySelector("#app").removeEventListener("scroll", this.hideTooltips);
  }

  //----------------------------------------------------------------------------
  // Event handlers
  //----------------------------------------------------------------------------
  scrollToTop() {
    document.querySelector("#app").scrollTop = 0;
  }

  openWorkshop = (slug) => {
    this.setState({ openWorkshop: slug });
    window.location.hash = `#workshop-${slug}`;
  }

  closeWorkshop = () => {
    this.setState({ openWorkshop: null });
    this.props.router.push(window.location.pathname);
  }

  getSlackInvite = (values) => {
    return getInviteToSlack(values.email);
  }

  handleHashChange = () => {
    this.setState({ openWorkshop: openWorkshop() });
  }

  hideTooltips = () => {
    ReactTooltip.hide();
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { workshops, handleSubmit, submitting, submitSucceeded, valid } = this.props;
    const { openWorkshop } = this.state;

    return (
      <div className="Landing" onClick={this.hideTooltips}>
        <div className="LandingHero">
          <div className="content">
            <h2>September 8th - 10th, 2017</h2>
            <h1>Create, code, and<br />learn with us in Porto</h1>
            <h3>Join us in the playground of the future for 3 days</h3>

            <Link to="/signup" className="signup">
              <Button straight cta large onClick={this.scrollToTop}>Apply Now</Button>
            </Link>
            <span className="open-until">Registration is open until September 2nd</span>

            <nav className="LandingSections">
              <ul>
                <li className="hackathon"><a href="#hackathon">Hackathon</a></li>
                <li className="workshops"><a href="#workshops">Workshops</a></li>
                <li className="schedule"><a href="#schedule">Schedule</a></li>
              </ul>
            </nav>
          </div>
        </div>

        {/* HACKATHON */}
        <section id="hackathon">
          <div className="content">
            <h1>&lt;&gt; hackathon</h1>
            <h2>A different kind of hackathon</h2>

            <p>Make or Break is 3 days of fun and learning, for everyone.<br />Step out of your comfort zone and join us and many other developers.</p>
            <p>The competition has 2 main phases:</p>
            <ul>
              <li>Make: 2 days to develop a software project (maybe add some hardware 🤓)</li>
              <li>Break: showcase your project to all participants in a small fair</li>
            </ul>
            <p>We've got everything you need to get your creative juices flowing: amazing mentors, yummy food, and a kickass chill-out zone!</p>
            <p><br />Please check the <a href="/rules" target="_blank" rel="noopener noreferrer">regulation</a> before applying.</p>

            <Link to="/signup" className="signup">
              <Button straight primary hollow large onClick={this.scrollToTop}>Apply Now</Button>
            </Link>

            <div className="image">
              <img src={landingHackathon} width="465" />
            </div>
          </div>
        </section>
        {/* END HACKATHON */}

        {/* WORKSHOPS */}
        <section id="workshops">
          <div className="content">
            <h1>{"//"} workshops</h1>
            <h2>Learn from the best while having fun</h2>

            <p>
              Make or Break is all about learning different subjects, from hardware to software, from recreational to serious.
            </p>
            <p>
              Prepare yourself for 3 days of workshops with amazing people working in the industry.
            </p>

            <ul className="workshops">
              {sortedWorkshops(workshops).map(workshop => (
                <li
                  key={workshop.slug}
                  className="workshop"
                  onClick={() => this.openWorkshop(workshop.slug)}
                >
                  <span className="date">{workshop.short_date}</span>
                  <span className="name">{workshop.name}</span>
                  <span className="speaker">with: {workshop.short_speaker}</span>
                  <span className="caret">&gt;</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        {/* END WORKSHOPS */}

        {/* SCHEDULE */}
        <section id="schedule-section">
          <div className="content">
            <div className="image">
              <img src={landingSchedule} />
            </div>

            <a className="anchor" id="schedule" />

            <h1>&#123;&#125; schedule (wip)</h1>
            <h2>It's a non-stop 3-day marathon!</h2>

            <div className="day">
              <h3>Day 1 - September 8th</h3>
              <h4>Welcome, work, and workshops</h4>

              <dl className="clearfix">
                <dt>09:00-12:00</dt>
                <dd>
                  <h5>Check-In</h5>
                  <p>Welcome kits</p>
                </dd>

                <dt>14:30</dt>
                <dd>
                  <h5>{get(workshops, "unity3d-gamedev.name")}</h5>
                  <p>Workshop</p>
                </dd>

                <dt>17:30</dt>
                <dd>
                  <h5>{get(workshops, "3d-printing.name")}</h5>
                  <p>Workshop</p>
                </dd>
              </dl>
            </div>

            <div className="day">
              <h3>Day 2 - September 9th</h3>
              <h4>Work and workshops all day</h4>

              <dl className="clearfix">
                <dt>10:30</dt>
                <dd>
                  <h5>{get(workshops, "iot.name")}</h5>
                  <p>Workshop</p>
                </dd>

                <dt>14:30</dt>
                <dd>
                  <h5>{get(workshops, "devops.name")}</h5>
                  <p>Workshop</p>
                </dd>

                <dt>17:30</dt>
                <dd>
                  <h5>{get(workshops, "design.name")}</h5>
                  <p>Workshop</p>
                </dd>
              </dl>
            </div>

            <div className="day">
              <h3>Day 3 - September 10th</h3>
              <h4>Final work stretch and hack fair</h4>

              <dl className="clearfix">
                <dt>10:30</dt>
                <dd>
                  <h5>{get(workshops, "hardware-maintenance.name")}</h5>
                  <p>Workshop</p>
                </dd>

                <dt>15:30</dt>
                <dd>
                  <h5>Hack Fair</h5>
                  <p>Showcase of developed projects</p>
                </dd>
              </dl>
            </div>

          </div>
        </section>
        {/* END SCHEDULE */}

        {/* JOIN_EVENT */}
        <section id="join-event">
          <div className="content">
            <div className="video">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/DYTZIlz8pK4?rel=0&amp;showinfo=0" frameBorder="0" allowFullScreen />
            </div>

            <p className="coming-soon">
              Join us while registration is open until September 2nd!
            </p>
            <p className="coming-soon">
              At <a href="https://goo.gl/maps/TeB6jEH1h962" target="_blank" rel="noopener noreferrer">Palácio dos Correios</a>, on September 8, 9, and 10
            </p>

            <Link to="/signup" className="apply">
              <Button straight primary hollow large onClick={this.scrollToTop}>Apply Now</Button>
            </Link>
          </div>
        </section>
        {/* END JOIN_EVENT */}

        {/* JOIN_SLACK */}
        <section id="join-slack">
          <div className="content">
            <h1>It's dangerous to go alone!</h1>

            <p>
              <a href="https://github.com/portosummerofcode/rules#1-man-teams" target="_blank" rel="noreferrer noopener">You can't apply to Make or Break alone</a>.
              However, you can join our Slack community and form a team with other lone rangers!
              Get your invite here:
            </p>

            <form onSubmit={handleSubmit(this.getSlackInvite)}>
              <Field id="email" name="email" component="input" type="text" placeholder="Email address" className="fullwidth" />
              <ErrorMessage form="slackInvite" field="email" />

              <Button
                type="submit"
                primary
                form
                centered
                fullwidth
                disabled={submitting || !valid}
                loading={submitting}
                submitSucceeded={submitSucceeded}
                feedbackLabel="Invite sent!"
              >
                Send invite to join our Slack
                <img src={slackMarkWhite} height="50" />
              </Button>
            </form>
          </div>
        </section>
        {/* END JOIN_SLACK */}

        {/* PRIZES */}
        <section id="prizes">
          <div className="content">
            <h1>[+] prizes</h1>
            <h2>Amazing prizes for the best projects</h2>

            <p>
              Make sure your project shines in at least one of our 3 categories: funny, useful, or hardcore!
              <br />
              We will award 3 different teams (one per category) and each member will get a prize.
              <br />
              Don't forget to read our <a href="/rules" target="_blank" rel="noopener noreferrer">rulebook</a>.
            </p>

            <div className="prizes">
              {PRIZES.map(({ image, title, prize }) => (
                <div key={title} className="prize">
                  <img src={image} alt={prize} />
                  <h3>{title}</h3>
                  <span>{prize}</span>
                </div>
              ))}
            </div>

            <div className="separator">
              <div className="ball" />
            </div>
          </div>
        </section>
        {/* END PRIZES */}

        {/* SPONSORS */}
        <section id="sponsors">
          <div className="content">

            <h1>! sponsors</h1>
            <h2>We have amazing partners and sponsors once again</h2>

            <ul>
              {SPONSORS.map(({ src, url, className, description }) => (
                <li
                  id={className}
                  key={src.toString()}
                  className={className}
                  data-tip={description}
                >
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <img src={src} />
                  </a>
                </li>
              ))}
            </ul>

            <div className="image"><img src={landingSponsors} width="376" /></div>
          </div>
        </section>
        {/* END SPONSORS */}


        {/* SHARE */}
        <section id="share">
          <div className="content">
            <h1>spread the word</h1>

            <p>
              We're always looking into bringing more talent, diversity and great ideas to our event.
              <br />
              Help us spread the word by sharing in your social networks.
            </p>

            <div className="actions">
              <a href="https://twitter.com/portosummercode/" target="_blank" rel="noopener noreferrer">
                <Button large hollow straight primary className="twitter">Twitter</Button>
              </a>
              <a href="https://www.facebook.com/portosummerofcode/" target="_blank" rel="noopener noreferrer">
                <Button large hollow straight primary className="fb">Facebook</Button>
              </a>
            </div>
          </div>
        </section>
        {/* END SHARE */}

        {/* workshop modals */}
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

        <ReactTooltip
          effect="solid"
          event="mouseover"
          eventOff="click"
          className="sponsor-tooltip"
          offset={{ left: 20 }}
          html
        />
      </div>
    );
  }

}

export default compose(
  setDisplayName("Landing"),

  getContext({
    router: PropTypes.object.isRequired,
  }),

  connect(({ workshops }) => ({ workshops })),

  reduxForm({
    form: "slackInvite",
    validate,
  }),
)(Landing);
