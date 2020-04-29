// @flow
import React, { useState } from "react";
import cx from "classnames";
import { format } from "date-fns";
import { P, Link, Card } from "components/2020/uikit";

type Props = {
  data: {}[]
};

const DailyFilter = ({ data }) => {
  const [activeDay, setActiveDay] = useState(0);
  const [activeTalk, setActiveTalk] = useState(0);

  return (
    <div className="dailyFilter">
      <div className="dayIndicators">
        <P>See Our Talks:</P>
        <ul>
          {data.map((day, i) => (
            <li
              className={cx("day", { active: activeDay === i})}
              key={`day-${i}`}
              onClick={() => {
                setActiveDay(i);
                setActiveTalk(0);
              }}
            >
              {`Dia ${i + 1}`}
            </li>
          ))}
        </ul>
      </div>
      <div className="talksList">
        {data[activeDay].talks.map((talk, i) => (
          <Card data={talk} key={`talk-${i}`} isActive={activeTalk === i} onClick={() => setActiveTalk(i)}/>
        ))}
      </div>
    </div>
  );
};

export default DailyFilter;
