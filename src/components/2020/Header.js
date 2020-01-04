import React, { useState } from "react";
import cx from "classnames";

import { Button } from "components/2020/uikit";

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
          <a href="#hackathon">Hackathon</a>
          <a href="#ai-competition">AI Competition</a>
          <a href="#location">Location</a>
          <a href="#mob-sessions">Mob Sessions</a>
          <a href="#news">News</a>
        </div>

        <div className={mobileCx}>
          <button className="header__mobile__close" onClick={closeMenu} />

          <div className="header__mobile__links">
            <a onClick={closeMenu} href="#hackathon">Hackathon</a>
            <a onClick={closeMenu} href="#ai-competition">AI Competition</a>
            <a onClick={closeMenu} href="#location">Location</a>
            <a onClick={closeMenu} href="#mob-sessions">Mob Sessions</a>
            <a onClick={closeMenu} href="#news">News</a>
          </div>

          <div className="header__mobile__actions">
            <Button size="regular" type="primary" inverted>Sign In</Button>
            <Button size="regular" type="primary" inverted>Apply Now</Button>
            <p className="header__mobile__lenny">
              (^ᴗ^) /
            </p>
          </div>

          {/*
          <button className="header__navigation__close" onClick={() => setOpen(false)} />

          <div className="header__navigation__mobile">
            <div>
              <a href="#hackathon">Hackathon</a>
              <a href="#ai-competition">AI Competition</a>
              <a href="#location">Location</a>
              <a href="#mob-sessions">Mob Sessions</a>
              <a href="#news">News</a>
            </div>
            <div>
              <Button size="regular" type="primary" inverted>Sign In</Button>
              <Button size="regular" type="primary" inverted>Apply Now</Button>
              <div className="header__navigation__mobile__lenny">
                (^ᴗ^) /
              </div>
            </div>
          </div>
          */}
        </div>
      </div>

      <div className="header__actions desktop">
        <Button size="small" type="secondary">Sign In</Button>
        <Button size="small" type="primary">Apply Now</Button>
      </div>

      <div className="header__actions mobile">
        <Button size="small" type="secondary" inverted>Apply Now</Button>
        <button className="header__hamburger" onClick={() => setOpen(true)} />
      </div>
    </div>
  );
};

export default Header;
