import React from "react";

import {
  Icon,
  Link,
  List,
  P,
} from "components/2020/uikit";

const Footer = () => (
  <div className="footer">
    <div className="footer__logo" />

    <div className="footer__resources">
      <P color="white">Resources</P>

      <List horizontal>
        <li><Link color="gray" to="#hackathon">Hackathon</Link></li>
        <li><Link color="gray" to="#agenda">Agenda</Link></li>
        <li><Link color="gray" to="#ai-competition">AI Competition</Link></li>
        <li><Link color="gray" to="#mob-session">MoB Sessions</Link></li>
        <li><Link color="gray" to="#news">News</Link></li>
        <li><Link color="gray" to="#sponsors">Sponsors</Link></li>
      </List>
    </div>

    <div className="footer__social">
      <P color="white">Find us on</P>

      <List horizontal>
        <li>
          <Link external to="mailto:info@makeorbreak.io">
            <Icon color="footer" type="email" />
          </Link>
        </li>
        <li>
          <Link external to="https://blog.makeorbreak.io/">
            <Icon color="footer" type="medium" />
          </Link>
        </li>
        <li>
        <Link external to="https://twitter.com/makeorbreakio">
          <Icon color="footer" type="twitter" />
        </Link>
        </li>
        <li>
        <Link external to="https://www.facebook.com/makeorbreak.io/">
          <Icon color="footer" type="facebook" />
        </Link>
        </li>
      </List>
    </div>

    <div className="footer__newsletter">
      <P>
        <Link to="/" color="gray">Subscribe to our newsletter</Link>
      </P>
    </div>

    <div className="footer__copyright">
      <P color="white">© MAKE OR BREAK 2020</P>
      <P color="gray">Co-organized by AlumniEI-FEUP</P>
    </div>
  </div>
);

export default Footer;
