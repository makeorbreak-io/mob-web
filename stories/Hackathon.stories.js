import React from "react";

import Hackathon from "components/landing/Hackathon";

export default { title: "Hackathon" };

export const OpenRegistrations = () => <Hackathon phase="openRegistrations" background="beige" />;
export const PreEvent = () => <Hackathon phase="preEvent" background="beige" />;
export const PostEvent = () => <Hackathon phase="postEvent" background="beige" />;
