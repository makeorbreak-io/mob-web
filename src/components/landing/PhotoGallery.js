// @flow

import React, { useState, useEffect } from "react";
import cx from "classnames";

import {
  Tag,
} from "components/2020/uikit";

type Props = {
  photos: [],
};

const photoProps = (index) => ([
  { background: "green", color: "white" },
  { background: "pink", color: "white" },
  { background: "yellow", color: "white" },
  { background: "red", color: "white" },
][index]);

const PhotoGallery = ({
  photos,
}: Props) => {
  const [current, setCurrent] = useState(0);
  const next = () => { current === photos.length - 1 ? setCurrent(0) : setCurrent(current + 1); };

  useEffect(() => {
    const interval = setInterval(next, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="photo-gallery">
      <div className="photo-gallery__photos">
        {photos.map(({ caption, image }, i) => {
          const className = cx("photo-gallery__photo", { "photo-gallery__photo--current": current === i });

          return (
            <div key={i} className={className}>
              <figure>
                <figcaption><Tag {...photoProps(i % 4)}>{caption}</Tag></figcaption>
                <img src={image} alt={caption} />
              </figure>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhotoGallery;

