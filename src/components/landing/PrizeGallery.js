// @flow

import React, { useState } from "react";
import cx from "classnames";

import {
  Button,
  Heading,
  P,
} from "components/2020/uikit";

type Props = {
  prizes: {},
};

const PrizeGallery = ({
  prizes,
}: Props) => {
  const [current, setCurrent] = useState(0);

  const prev = () => { current === 0 ? setCurrent(prizes.length - 1) : setCurrent(current - 1); };
  const next = () => { current === prizes.length - 1 ? setCurrent(0) : setCurrent(current + 1); };
  const goTo = (i) => () => setCurrent(i);

  return (
    <div className="prize-gallery">
      <div className="prize-gallery__prev"><Button size="chevron" level="primary" onClick={prev} /></div>
      <div className="prize-gallery__next"><Button size="chevron" level="primary" onClick={next} /></div>

      <div className="prize-gallery__prizes">
        {prizes.map(({ category, image, alt }, i) => {
          const className = cx("prize-gallery__prize", { "prize-gallery__prize--current": current === i });
          const pos = i === current ? 0 : i - current;
          const style = { "--pos": pos };

          return (
            <div key={category} className={className} style={style} onClick={goTo(i)}>
              <div className="prize-gallery__prize__image">
                <img src={image} alt={alt} />
              </div>
              <div className="prize-gallery__prize__description">
                <Heading size="s" color="purple">{i}: {category}</Heading>
              </div>
            </div>
          );
        })}
      </div>

      <div className="prize-gallery__navigation">
        {prizes.map(({ category, image, alt }, i) => {
          const className = cx("prize-gallery__navigation__item", {
            "prize-gallery__navigation__item--current": i === current,
          });

          return (
            <div key={category} className={className} onClick={goTo(i)}>
              <img src={image} alt={alt} />

              <hr />

              <P color="white">{category}</P>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrizeGallery;
