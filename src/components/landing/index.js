import "./styles";

import React, { Component } from "react";
import { Link } from "react-router";
import { compose, setDisplayName } from "recompose";

//
// Components
import { Button } from "uikit";

//
// Assets
import landingHackathon from "assets/images/landing-hackathon@2x.jpg";
import landingSchedule from "assets/images/landing-schedule@2x.jpg";
// import landingJoinEvent from "assets/images/landing-join-event@2x.jpg";
import landingSponsors from "assets/images/landing-sponsors@2x.jpg";

import sponsorLiberty from "assets/images/sponsor-liberty.svg";
import sponsorCMP from "assets/images/sponsor-cmp.svg";
import sponsorCisco from "assets/images/sponsor-cisco.svg";
import sponsorDoist from "assets/images/sponsor-doist.svg";
import sponsori2s from "assets/images/sponsor-i2s.svg";
import sponsorBlip from "assets/images/sponsor-blip.svg";
import sponsorSemasio from "assets/images/sponsor-semasio.svg";
import sponsorMindera from "assets/images/sponsor-mindera.png";
import sponsorAlientech from "assets/images/sponsor-alientech.svg";

const SPONSORS = [
  { src: sponsorLiberty   , url: "http://www.libertyseguros.pt/" },
  { src: sponsorCMP       , url: "http://www.cm-porto.pt/" },
  { src: sponsorCisco     , url: "http://www.cisco.com/c/pt_pt/index.html" },
  { src: sponsorDoist     , url: "https://doist.com/" },
  { src: sponsori2s       , url: "http://www.i2s.pt/index/" },
  { src: sponsorBlip      , url: "http://www.blip.pt/" },
  { src: sponsorSemasio   , url: "http://www.semasio.com/" },
  { src: sponsorMindera   , url: "https://www.mindera.com/" },
  { src: sponsorAlientech , url: "https://www.alientech.pt/" },
];

export class Landing extends Component {

  scrollToTop() {
    document.querySelector("#app").scrollTop = 0;
  }

  render() {
    return (
      <div className="Landing">
        <div className="LandingHero">
          <div className="content">
            <h2>September 8th - 10th, 2017</h2>
            <h1>Create, Code and<br />Learn with us in Porto</h1>
            <h3>Join us in the playground of the future for 3 days</h3>

            <Link to="/signup"><Button straight cta large>Apply Now</Button></Link>

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

            <p>Make or Break is all about having fun learning what we love most to create and code.</p>
            <p>Spend 3 days with us and many developers to take a step out of your comfort zone. Experiment with a new platform, API, or that idea that's always been in the back of your mind!</p>
            <p>Make or Break is for everyone. We've got everything you need to get your creative juices flowing: amazing mentors, yummy food, and a kickass chill-out zone!</p>
            <p><br />Please check the <a href="/rules" target="_blank" rel="noopener noreferrer">regulation</a> before applying.</p>

            <Link to="/signup"><Button straight primary hollow large onClick={this.scrollToTop}>Apply Now</Button></Link>

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
              Make or Break is all about learning.
            </p>
            <p>
              Prepare yourself for 3 days of workshops with amazing people working in the industry.
            </p>
            <p>
              Take your participation one step further and learn different subjects, from hardware to software, from recreational to serious.
            </p>

            <p className="coming-soon">Workshops to be announced soon</p>
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
              </dl>
            </div>

            <div className="day">
              <h3>Day 2 - September 9th</h3>
              <h4>Work and workshops all day</h4>
            </div>

            <div className="day">
              <h3>Day 3 - September 10th</h3>
              <h4>Final work stretch and hack fair</h4>

              <dl className="clearfix">
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
              Join us while registration is open!
            </p>
            <p className="coming-soon">
              At <a href="https://goo.gl/maps/TeB6jEH1h962" target="_blank" rel="noopener noreferrer">Palácio dos Correios</a>, on September 8, 9, and 10
            </p>

            <Link to="/signup"><Button straight primary hollow large onClick={this.scrollToTop}>Apply Now</Button></Link>
          </div>
        </section>
        {/* END JOIN_EVENT */}

        {/* SPONSORS */}
        <section id="sponsors">
          <div className="content">
            <h1>! sponsors</h1>
            <h2>We have amazing partners and sponsors once again</h2>

            <ul>
              {SPONSORS.map(({ src, url }) => (
                <li key={src.toString()}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <img src={src} width="150" />
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
      </div>
    );
  }

}

export default compose(
  setDisplayName("Landing"),
)(Landing);
