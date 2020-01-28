// @flow
import React, { useState } from "react";
import { Heading, P } from "components/2020/uikit";

const Accordion = () => {
  const [makeState, setMakeState] = useState("open");
  const [breakState, setBreakState] = useState("open");

  const onMakeClick = () =>
    setMakeState(makeState => (makeState === "open" ? "closed" : "open"));
  const onBreakClick = () =>
    setBreakState(breakState => (breakState === "open" ? "closed" : "open"));

  return (
    <ul className="Accordion">
      <li>
        <div className={`Title state--${makeState}`} onClick={onMakeClick}>
          <Heading size="s" color="purple">
            1. Make
          </Heading>
          <i className={`Chevron state--${makeState}`} />
        </div>
        <P>Two days to develop a software project (maybe add some hardware).</P>
      </li>
      <li>
        <div className={`Title state--${breakState}`} onClick={onBreakClick}>
          <Heading size="s" color="purple">
            2. Break
          </Heading>
          <i className={`Chevron state--${breakState}`}></i>
        </div>
        <P>Showcase your project to all participants in a small fair.</P>
      </li>
    </ul>
  );
};

export default Accordion;
