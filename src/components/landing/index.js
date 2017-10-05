import "./styles";
import "./styles.responsive";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { compose, setDisplayName, getContext } from "recompose";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { map, isEmpty } from "lodash";
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
import { openWorkshop } from "util/workshops";

//
// validation
import { composeValidators, validateEmail, validatePresence } from "validators";

//
// Assets
import landingSponsors from "assets/images/img_sponsors_photo_with_yellow@2x.jpg";
import thankYou from "assets/images/2nd_photo@2x.png";
import slackMarkWhite from "assets/images/slack-white.svg";
import hackathon from "assets/images/img_wireframe_color@2x.png";
import separatorImage from "assets/images/img_mid_photo@2x.jpg";

import SPONSORS from "./sponsors";

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
            <h2>It happened September 8th - 10th, 2017</h2>
            <h1>Create, code, and<br />learn with us in Porto</h1>
            <h3>For 3 days you've joined join us in the playground for the future</h3>

            <a href="#join-slack" className="signup">
              <Button straight large inactive disabled>Apply Now</Button>
            </a>
            <span className="open-until">Registration is closed. Please try again next year!</span>
            <a href="#get-notified">Notify Me When Registrations Open Again</a>
          </div>
        </div>

        {/* THANKYOU */}
        <section id="thanks">
          <div className="content">
            <h1>&lt;&gt; thank you</h1>
            <h3>
              You've worked, played and stayed up all night. <br />
              Coded, made friends along the way and learned.
            </h3>
            <h3>
              Thank you for being part of this year's event.
              <br/>
              You made it!
            </h3>
            <h3>
              We hope to see you here again next year!
            </h3>

            <div className="image">
              <img src={thankYou} width="465" />
            </div>
          </div>
        </section>
        {/* END THANKYOU */}

        {/* HACKATHON */}
        <section id="hackathon">
          <div className="content">
            <div className="info">
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

              <a href="#get-notified">
                <Button straight primary hollow large>Notify Me</Button>
              </a>
              <div className="notify">Let me know when the registration opens again.</div>
            </div>
            <div className="image">
              <img src={hackathon} width="465" />
            </div>
          </div>
        </section>
        {/* END HACKATHON */}

        {/* SEPARATOR */}
        <section id="separator">
          <img src={separatorImage} alt=""/>
        </section>
        {/* END SEPARATOR */}

        {/* JOIN_SLACK */}
        <section id="join-slack">
          <div className="content">
            <h1>It's dangerous to go alone!</h1>
            <h2>A different kind of hackathon...</h2>
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

        {/* GET_NOTIFIED */}
        <section id="get-notified">
          <div className="content">
          <h1 className="header-subscription">Get notified</h1>
          <p>Join our mailing list to receive updates on Make or Break's 2018 edition</p>
          <div id="mc_embed_signup">
            <form action="//portosummerofcode.us8.list-manage.com/subscribe/post?u=1b6e195ef5bf93f16b5c4c5a4&amp;id=c59d1784a4" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                <div id="mc_embed_signup_scroll">
                  <input type="email" name="EMAIL" className="email" id="mce-EMAIL" placeholder="Email address" required />
                  <div style={{ position: "absolute", left: -5000 + "px" }} aria-hidden="true">
                    <input type="text" name="b_1b6e195ef5bf93f16b5c4c5a4_c59d1784a4" tabIndex="-1" value="" />
                  </div>
                  <div className="clear">
                    <button type="submit" name="subscribe" id="mc-embedded-subscribe" className="Button primary form centered fullwidth">Subscribe</button>
                  </div>
                </div>
            </form>
          </div>
          </div>
        </section>
        {/* END GET_NOTIFIED */}

        {/* SPONSORS */}
        <section id="sponsors">
          <div className="content">

            <h1>call for sponsors</h1>
            <h2>Why you should join us</h2>

            <p>Join us in 2018 for another edition of Make or Break. This time, we’ll be back earlier with an even better event.</p>
            <p>Our goals are the same as always:</p>

            <ul className="sponsors-reasons">
              <li>galvanize Porto's tech scene, giving back to the city and country that made us the persons and professionals we are;</li>
              <li>improve our culture, as we encourage all kinds of developers to participate, specially students, helping them achieve their full potential, and provide better opportunities to the newer generations;</li>
              <li>have all the players in one place at the same time: students, educators, professionals, entrepreneurs, politicians, educational institutions, organizations, companies... it all starts here;</li>
              <li>bridge the divide between developers and companies, by enabling businesses to become active participants and supporters of the tech community of the city.</li>
            </ul>

            <p>We'll have (even better):</p>

            <ul className="sponsors-reasons">
              <li>Hackathon with hack fair</li>
              <li>Workshops</li>
              <li>Side activities like board-games and video-games</li>
              <li>A larger audience</li>
            </ul>

            <p>Some surprises may include:</p>

            <ul className="sponsors-reasons">
              <li>Talks</li>
              <li>Tech booths</li>
              <li>Meetups</li>
              <li>Pre-event activities</li>
            </ul>
            <Link to="mailto:info@portosummerofcode.com" className="signup">
              <Button straight primary hollow large>Become a Sponsor</Button>
            </Link>

            <h3>2017 edition sponsors</h3>
            <ul className="sponsors-list">
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
