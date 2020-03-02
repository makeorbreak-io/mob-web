// @flow

import React from "react";

import { Tag } from "components/2020/uikit";

type Props = {
  prizes: [],
};

const colors = [
  "green",
  "yellow",
  "red",
  "blue",
];

const AICompetitionPrizes = ({
  prizes,
}: Props) => (
  <div className="ai-competition-prizes">
    {prizes.map(({ title, image, alt, details }, i) => (
      <div key={title} className="ai-competition-prize">
        <img src={image} alt={alt} />
        <Tag background={colors[i % colors.length]} color="white">{title}</Tag>

        <div className="ai-competition-prize__description">
          <div className="ai-competition-prize__details">
            {details.map((detail, i) => (
              <li key={i} className="ai-competition-prize__detail">
                {detail}
              </li>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default AICompetitionPrizes;
