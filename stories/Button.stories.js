import React from "react";

import Button from "components/2020/uikit/Button";

export default { title: "Button" };

export const regularPrimary   = () => (<Button size="regular" type="primary">Label</Button>);
export const regularSecondary = () => (<Button size="regular" type="secondary">Label</Button>);
export const regularTertiary  = () => (<Button size="regular" type="tertiary">Label</Button>);

export const largePrimary     = () => (<Button size="large" type="primary">Label</Button>);
export const largeSecondary   = () => (<Button size="large" type="secondary">Label</Button>);
export const largeTertiary    = () => (<Button size="large" type="tertiary">Label</Button>);

export const smallPrimary     = () => (<Button size="small" type="primary">Label</Button>);
export const smallSecondary   = () => (<Button size="small" type="secondary">Label</Button>);
export const smallTertiary    = () => (<Button size="small" type="tertiary">Label</Button>);

export const chevronPrimary   = () => (<Button size="chevron" type="primary" />);
export const chevronSecondary = () => (<Button size="chevron" type="secondary" />);
