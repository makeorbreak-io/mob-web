import React from "react";

import { Section, Button } from "components/2020/uikit";

export default { title: "Button" };

export const Regular = () => (
  <>
    <Section>
      <Button size="regular" level="primary">Primary</Button>
    </Section>

    <Section>
      <Button size="regular" level="secondary">Secondary</Button>
    </Section>

    <Section>
      <Button size="regular" level="secondary" inverted>Secondary inverted</Button>
    </Section>

    <Section background="black">
      <Button size="regular" level="tertiary">Tertiary</Button>
    </Section>
  </>
);

export const Large = () => (
  <>
    <Section>
      <Button size="large" level="primary">Primary</Button>
    </Section>

    <Section>
      <Button size="large" level="secondary">Secondary</Button>
    </Section>

    <Section background="black">
      <Button size="large" level="tertiary">Tertiary</Button>
    </Section>
  </>
);

export const Small = () => (
  <>
    <Section>
      <Button size="small" level="primary">Primary</Button>
    </Section>

    <Section>
      <Button size="small" level="secondary">Secondary</Button>
    </Section>

    <Section>
      <Button size="small" level="secondary" inverted>Secondary inverted</Button>
    </Section>

    <Section background="black">
      <Button size="small" level="tertiary">Tertiary</Button>
    </Section>
  </>
);

export const chevronPrimary   = () => (
  <Section>
    <Button size="chevron" level="primary" />
  </Section>
);
export const chevronSecondary = () => (
  <Section>
    <Button size="chevron" level="secondary" />
  </Section>
);
