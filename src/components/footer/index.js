import "./styles";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";

//
// Assets
import logoWhite from "assets/images/psc-logo-white.svg";
import fb from "assets/images/fb-grey.svg";
import twitter from "assets/images/twitter-grey.svg";

export class Footer extends Component {

  render() {
    return (
      <div className="Footer">

        <div className="FooterTop">
          <div className="content">
            <div className="FooterSection">
              <h1>By Porto Summer of Code</h1>
              <p>
                <img src={logoWhite} alt="Porto Summer of Code logo" />
                <span>
                  Make or Break is a 3-day tech fest with prizes, workshops, gadgets, food, and more.
                  <br />
                  Brought to you by the Porto Summer of Code team!
                </span>
              </p>
            </div>

            <div className="FooterSection columns">
              <div className="FooterSectionColumn">
                <h3>Events</h3>

                <a target="_blank" rel="noopener noreferrer" href="https://portosummerofcode.com/psc-16">2016</a>
                <a target="_blank" rel="noopener noreferrer" href="https://portosummerofcode.com/psc-15">2015</a>
                <a target="_blank" rel="noopener noreferrer" href="https://portosummerofcode.com/psc14">2014</a>
              </div>

              <div className="FooterSectionColumn wide">
                <h3>Organization</h3>

                <a target="_blank" rel="noopener noreferrer" href="https://portosummerofcode.com">About Us</a>
                <a target="_blank" rel="noopener noreferrer" href="mailto:info@portosummerofcode.com">Sponsor Us</a>
              </div>

              <div className="FooterSectionColumn">
                <h3>Resources</h3>

                <a target="_blank" rel="noopener noreferrer" href="https://github.com/portosummerofcode/rules">Event Info</a>
                <a target="_blank" rel="noopener noreferrer" href="https://portosummerofcode.com/blog/">Blog</a>
                <a target="_blank" rel="noopener noreferrer" href="mailto:info@portosummerofcode.com">Contact</a>
              </div>
            </div>
          </div>
        </div>

        <div className="FooterBottom">
          <div className="content">
            <div className="copyright">
              © Porto Summer of Code 2017
            </div>

            <div className="social-media">
              <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/portosummerofcode/">
                <img height="20" src={fb} alt="Porto Summer of Code Faceook page" />
              </a>
              <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/portosummercode">
                <img height="20" src={twitter} alt="Porto Summer of Code Twitter account" />
              </a>
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
