// @flow

import React from "react";

import {
  Button,
  Heading,
  Link,
  P,
  Section,
  Tag,
} from "components/2020/uikit";

const Hero = () => (
  <Section background="beige" center>
    <Tag background="white" color="purple">TBD 2020</Tag>

    <Heading size="xl" color="purple" centered>
      Create, code, and<br />
      learn with us
    </Heading>

    <P>
      Three days hackathon, talks, stories and activities to
      Make or Break, in the heart of Porto
    </P>

    <Button size="large" level="primary">
      Apply Now
    </Button>
  </Section>
);

const Prizes = () => (
  <Section background="black" center>
    <Heading size="xl" color="blue" centered>You can win amazing prizes</Heading>

    <P color="white">
      Apply and experiment with a new idea to win amazing prizes!
      <br />
      (one per member of each category's winning team)
    </P>

    <P color="white" large>
      More intered in an AI competition?
      <br />
      No problem, we have special prizes for that!
    </P>
  </Section>
);

const Workshops = () => (
  <Section background="white" center>
    <Tag background="yellow" color="white">Workshops</Tag>

    <Heading size="xl" color="black" centered>Come learn with us!</Heading>

    <P>
      Make or Break is all about learning. Step out of your confort zone and
      join us and many other developers and hackers. We feature a wide variety
      of experts and subjects so you can learn a bit of everything
    </P>
  </Section>
);

const Talks = () => (
  <Section background="beige">
  </Section>
);

const AICompetition = () => (
  <Section background="black">
    <Tag background="green" color="white">AI Competition</Tag>

    <Heading size="xl" color="white">One bot to rule the board!</Heading>

    <P color="white">
      The goal is to create an AI agent capable of playing bomberman against a
      number of oponents
      <br />
      You will develop your bot using the <Link external to="https://www.lua.org/" color="white">Lua scripting language</Link>
      <br />
      Hop on to our rules page to know more!
    </P>

    <Button size="regular" level="primary">Apply now</Button>
    <Button size="regular" level="tertiary">Regulation</Button>
  </Section>
);

const AICompetitionPrizes = () => (
  <Section background="black" center>
    <Heading size="xl" color="green" centered>
      AI Competition Prizes
    </Heading>
  </Section>
);

const Location = () => (
  <Section background="white">
    <Tag background="red" color="white">Location</Tag>

    <Heading size="xl" color="black">
      Palácio dos Correios,
      <br />
      Porto
    </Heading>
  </Section>
);

const Gallery = () => (
  <Section background="white">
  </Section>
);

const MobSessions = () => (
  <></>
);

const News = () => (
  <Section background="beige">
    <Tag background="purple" color="white">Latest News</Tag>
  </Section>
);

const Sponsors = () => (
  <Section background="white" center>
    <Tag background="purple" color="white">Sponsors</Tag>

    <Heading size="xl" color="black" centered>We have some amazing sponsors</Heading>

    <Button size="large" level="primary">
      Become a sponsor
    </Button>
  </Section>
);

const Landing = () => (
  <>
    <Hero />

    <Prizes />

    <Workshops />

    <Talks />

    <AICompetition />
    <AICompetitionPrizes />

    <Location />

    <Gallery />

    <MobSessions />

    <News />

    <Sponsors />
  </>
);

export default Landing;
