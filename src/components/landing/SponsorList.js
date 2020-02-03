// @flow

import React from "react";

import { Link } from "components/2020/uikit";

type Props = {
  sponsors: [],
};

const SponsorList = ({
  sponsors,
}: Props) => (
  <ul className="sponsor-list">
    {sponsors.map(({ image, name, url }) => (
      <li key={name} className="sponsor-list__sponsor">
        <Link unstyled external to={url}>
          <img src={image} alt={name} />
        </Link>
      </li>
    ))}
  </ul>
);

export default SponsorList;
