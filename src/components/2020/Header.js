import React, { useState } from "react";
import cx from "classnames";

import {
  Button,
  Link,
} from "components/2020/uikit";

const Header = () => {
  const [open, setOpen] = useState(false);
  const mobileCx = cx("mobile", "header__mobile", {
    "header__mobile--open": open,
  });

  const closeMenu = () => setOpen(false);

  return (
    <div className="header">
      <div className="header__logo desktop" />
      <div className="header__logo mobile" />

      <div className="header__navigation">
        <div className="desktop">
          <Link color="purple" to="#hackathon">Hackathon</Link>
          <Link color="purple" to="#ai-competition">AI Competition</Link>
          <Link color="purple" to="#location">Location</Link>
          <Link color="purple" to="#mob-sessions">Mob Sessions</Link>
          <Link color="purple" to="#news">News</Link>
        </div>

        <div className={mobileCx}>
          <button className="header__mobile__close" onClick={closeMenu} />

          <div className="header__mobile__links">
            <Link color="white" onClick={closeMenu} to="#hackathon">Hackathon</Link>
            <Link color="white" onClick={closeMenu} to="#ai-competition">AI Competition</Link>
            <Link color="white" onClick={closeMenu} to="#location">Location</Link>
            <Link color="white" onClick={closeMenu} to="#mob-sessions">Mob Sessions</Link>
            <Link color="white" onClick={closeMenu} to="#news">News</Link>
          </div>

          <div className="header__mobile__actions">
            <Button size="regular" level="primary" inverted>Sign In</Button>
            <Button size="regular" level="primary" inverted>Apply Now</Button>
            <p className="header__mobile__lenny">
              (^ᴗ^) /
            </p>
          </div>
        </div>
      </div>

      <div className="header__actions desktop">
        <Button size="small" level="secondary">Sign In</Button>
        <Button size="small" level="primary">Apply Now</Button>
      </div>

      <div className="header__actions mobile">
        <Button size="small" level="secondary" inverted>Apply Now</Button>
        <button className="header__hamburger" onClick={() => setOpen(true)} />
      </div>
    </div>
  );
};

export default Header;
