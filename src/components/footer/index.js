import "./styles";
import "./styles.responsive";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";

//
// Assets
import email from "assets/images/email-white.svg";
import fb from "assets/images/fb-white.svg";
import twitter from "assets/images/twitter-white.svg";

export class Footer extends Component {

  render() {
    return (
      <div className="Footer">

        <div className="FooterTop">
          <div className="content">
            <div className="FooterSection">
              <h3>© Make or Break 2018</h3>
              <p>
                <span>
                  Make or Break is a 3-day tech fest with prizes, workshops, gadgets, food, and more.
                  <br />
                  Co-organized by <a href="http://alumniei.fe.up.pt/" target="_blank" rel="noopener noreferrer">AlumniEI-FEUP</a>
                </span>
              </p>
            </div>

            <div className="FooterSection columns">
              <div className="FooterSectionColumn">
                <h3>Past</h3>

                <a target="_blank" rel="noopener noreferrer" href="https://medium.com/makeorbreak-io/make-or-break-more-than-a-hackathon-45d43c0042ba">2017</a>
                <a target="_blank" rel="noopener noreferrer" href="https://makeorbreak.io/psc-16">2016</a>
                <a target="_blank" rel="noopener noreferrer" href="https://makeorbreak.io/psc-15">2015</a>
                <a target="_blank" rel="noopener noreferrer" href="https://makeorbreak.io/psc14">2014</a>
              </div>

              <div className="FooterSectionColumn wide">
                <h3>Resources</h3>

                <a target="_blank" rel="noopener noreferrer" href="/rules">Event Rules</a>
                <a target="_blank" rel="noopener noreferrer" href="https://blog.makeorbreak.io/">Blog</a>
                <a target="_blank" rel="noopener noreferrer" href="mailto:info@makeorbreak.io">Sponsor Us</a>
              </div>

              <div className="FooterSectionColumn with-icons">
                <h3>Contacts</h3>

                <a target="_blank" rel="noopener noreferrer" href="mailto:info@makeorbreak.io">
                  <img height="15" src={email} alt="Make or Break email address" />
                  Email
                </a>
                <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/makeorbreak.io/">
                  <img height="17" src={fb} alt="Make or Break Facebook page" />
                  Facebook
                </a>
                <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/makeorbreakio/">
                  <img height="17" src={twitter} alt="Make or Break Twitter account" />
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

}

export default compose(
  setDisplayName("Footer"),
)(Footer);
