import React from "react";

import { Section, Button } from "components/2020/uikit";

export default { title: "Button" };

export const Regular = () => (
  <>
    <Section>
      <Button size="regular" type="primary">Primary</Button>
    </Section>

    <Section>
      <Button size="regular" type="secondary">Secondary</Button>
    </Section>

    <Section>
      <Button size="regular" type="secondary" inverted>Secondary inverted</Button>
    </Section>

    <Section background="black">
      <Button size="regular" type="tertiary">Tertiary</Button>
    </Section>
  </>
);

export const Large = () => (
  <>
    <Section>
      <Button size="large" type="primary">Primary</Button>
    </Section>

    <Section>
      <Button size="large" type="secondary">Secondary</Button>
    </Section>

    <Section background="black">
      <Button size="large" type="tertiary">Tertiary</Button>
    </Section>
  </>
);

export const Small = () => (
  <>
    <Section>
      <Button size="small" type="primary">Primary</Button>
    </Section>

    <Section>
      <Button size="small" type="secondary">Secondary</Button>
    </Section>

    <Section>
      <Button size="small" type="secondary" inverted>Secondary inverted</Button>
    </Section>

    <Section background="black">
      <Button size="small" type="tertiary">Tertiary</Button>
    </Section>
  </>
);

export const chevronPrimary   = () => (
  <Section>
    <Button size="chevron" type="primary" />
  </Section>
);
export const chevronSecondary = () => (
  <Section>
    <Button size="chevron" type="secondary" />
  </Section>
);
