import React from "react";
import { BrowserRouter } from "react-router-dom";

import {
  Heading,
  Link,
  P,
  Section
} from "components/2020/uikit";

export default { title: "Typography" };

const colors = (size, centered = false) => (
  ["black", "white", "purple", "blue", "green"].map((color) => (
    <Section key={`${size}-${color}`} background={color === "white" ? "black" : "white" }>
      <Heading {...{ size, color }}>Heading {size.toUpperCase()} {color}</Heading>
      {centered &&
        <Heading {...{ size, color }} centered>Heading {size.toUpperCase()} centered {color}</Heading>
      }
    </Section>
  ))
);

export const Headings = () => (
  <Section>
    <Heading>Heading Default (XL)</Heading>
    <Heading centered>Heading Default (XL) centered</Heading>

    <hr />

    {colors("xl", true)}

    <hr />

    <Heading size="l">Heading L</Heading>
    {colors("l")}

    <hr />

    <Heading size="m">Heading M</Heading>
    {colors("m")}

    <hr />

    <Heading size="s">Heading S</Heading>
    {colors("s")}
  </Section>
);

export const Text = () => (
  <>
    <Section>
      <P large>P large</P>
      <P>P default</P>
    </Section>

    <Section background="black">
      <P color="white" large>P white large</P>
      <P color="white">P white default</P>
    </Section>
  </>
);

export const Links = () => (
  <BrowserRouter>
    <Section>
      <P>
        <Link to="/">Internal Link to /</Link>
      </P>
    </Section>

    <Section>
      <P>
        <Link to="#example">Anchor Link to #example (broken because storybook)</Link>
      </P>
    </Section>

    <Section>
      <P>
        <Link external to="https://google.com">External Link to google</Link>
      </P>
    </Section>
  </BrowserRouter>
);

export const FullExample = () => (
  <Section>
    <Heading size="xl" color="purple" centered>A nice title</Heading>

    <P large>
      Important text <Link external to="https://google.com">should</Link> be larger
    </P>
    <P>
      than regular text that may contain more, but not as critical, information.
      <br />
        Like this one does. And maybe <Link external to="https://google.com"></Link>
    </P>
  </Section>
);
