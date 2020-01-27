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

import PrizeGallery from "components/landing/PrizeGallery";
const prizes = [
  { category: "Fun"      , alt: "", image: "https://placehold.it/360x360" },
  { category: "Useful"   , alt: "", image: "https://placehold.it/360x360" },
  { category: "Creative" , alt: "", image: "https://placehold.it/360x360" },
];

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
  <Section background="black" id="hackathon" center>
    <Heading size="xl" color="blue" centered>You can win amazing prizes</Heading>

    <P color="white">
      Apply and experiment with a new idea to win amazing prizes!
      <br />
      (one per member of each category's winning team)
    </P>

    <PrizeGallery prizes={prizes} />

    <P color="white" large>
      More interested in an AI competition?
      <br />
      No problem, we have special prizes for that!
    </P>
  </Section>
);

const Workshops = () => (
  <Section background="white" id="workshops" center>
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
  <Section background="beige" id="talks">
  </Section>
);

const AICompetition = () => (
  <Section background="black" id="ai-competition">
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
  <Section background="white" id="location">
    <Tag background="red" color="white">Location</Tag>

    <Heading size="xl" color="black">
      Palácio dos Correios,
      <br />
      Porto
    </Heading>
  </Section>
);

const Gallery = () => (
  <Section background="white" id="gallery">
  </Section>
);

const MobSessions = () => (
  <></>
);

const News = () => (
  <Section background="beige" id="news">
    <Tag background="purple" color="white">Latest News</Tag>
  </Section>
);

const Sponsors = () => (
  <Section background="white" id="sponsors" center>
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
