// @flow
import React from "react";
import cx from "classnames";
import { format } from "date-fns";
import { Heading, P, Link } from "components/2020/uikit";

type Props = {
  isActive: boolean,
  data: {
    date: Date,
    title: string,
    speaker: string,
    link: string,
  },
  onClick: () => void,
  day: number,
  big: boolean,
  src: string
};



const Card = ({ isActive, data: { date, title, speaker: { name, job }, link = "/", summary }, onClick, day = 1, big = false, src = "http://via.placeholder.com/458" }) => {
  const textColor = isActive ? "white" : "black";
  return (
    <article
      className={cx(`card background--${isActive ? "purple" : "white"} text-color--${textColor}`, { big })}
      onClick={onClick}
    >
      {big && <img src={src} />}
      <div className="innerCard">
        <div className="timeslot">
          <time>{format(date, "MMMM DD, dddd, HH:mm")}</time>
          {big && (
            <div className="day">{`Day ${day}`}</div>
          )}
        </div>
          {big ?
            <Heading size="l" color="white">{title}</Heading> :
            <P large color={textColor} aria-role="heading">
              {title}
            </P>
          }
        {big && <P color="white">{summary}</P>}
        <div className="card-footer">
          <div className="speaker-info">
            <P additional={!big} color={textColor}>
              {name}
            </P>
            {big && <P>({job})</P>}
          </div>
          <Link to={link || "/"} color={textColor}>
            More
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Card;
