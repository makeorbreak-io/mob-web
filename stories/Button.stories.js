import React from "react";

import Button from "components/2020/uikit/Button";

export default { title: "Button" };

export const Regular = () => (
  <>
    <section>
      <Button size="regular" type="primary">Primary</Button>
    </section>

    <section>
      <Button size="regular" type="secondary">Secondary</Button>
    </section>

    <section>
      <Button size="regular" type="secondary" inverted>Secondary inverted</Button>
    </section>

    <section className="black">
      <Button size="regular" type="tertiary">Tertiary</Button>
    </section>
  </>
);

export const Large = () => (
  <>
    <section>
      <Button size="large" type="primary">Primary</Button>
    </section>

    <section>
      <Button size="large" type="secondary">Secondary</Button>
    </section>

    <section className="black">
      <Button size="large" type="tertiary">Tertiary</Button>
    </section>
  </>
);

export const Small = () => (
  <>
    <section>
      <Button size="small" type="primary">Primary</Button>
    </section>

    <section>
      <Button size="small" type="secondary">Secondary</Button>
    </section>

    <section>
      <Button size="small" type="secondary" inverted>Secondary inverted</Button>
    </section>

    <section className="black">
      <Button size="small" type="tertiary">Tertiary</Button>
    </section>
  </>
);

export const chevronPrimary   = () => (
  <section>
    <Button size="chevron" type="primary" />
  </section>
);
export const chevronSecondary = () => (
  <section>
    <Button size="chevron" type="secondary" />
  </section>
);
