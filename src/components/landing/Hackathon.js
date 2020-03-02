// @flow

import React from "react";
import { Heading, P, Button, Tag, Accordion } from "components/2020/uikit";

type Props = {
  children: React.Node,
  phase: "openRegistrations" | "preEvent" | "postEvent",
  background: "white" | "beige"
};

const Hackathon = ({ phase = "openRegistrations", background = "beige" }) => <section className={`hackathon background--${background}`}>
  <div className="side1">
    <div>
      <Tag color="white" background="blue">Hackathon</Tag>
    </div>
    <Heading size="xl">{"FIRST YOU MAKE,\nTHEN YOU BREAK"}</Heading>
    <P>Three days hackathon for everyone, divided into two main phases.</P>
  </div>
   {
    phase === "openRegistrations" &&
      <div className="cta">
        <Button size="regular" level="primary">Apply Now</Button>
        <Button size="regular" level="secondary">Regulation</Button>
      </div>
    }
  <div className="side2">
    {phase !== "postEvent" && <Accordion />}
    {phase === "openRegistrations" && <P>We've got great prizes, mentors, food, and a kickass chill-out zone!</P>}
    {phase === "postEvent" &&
      <>
        <P>
          Make or Break is the largets tech community event in the city of Porto, Portugal. It consists of a hackathon, a demo fair,
          a series of workshops, programming contests and other activities.
        </P>
        <P>Everyone can participate. It's free, it's fun and there are prizes for the best projects.</P>
      </>
    }
  </div>
</section>;

export default Hackathon;
