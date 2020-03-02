import React from "react";

const talksPerDays = [
  [
    {
      date: new Date("2020-10-21T20:00:00Z"),
      title: "First talk title",
      speaker: "First speaker",
    },
    {
      date: new Date("2020-10-21T21:00:00Z"),
      title: "Second talk title",
      speaker: "Second speaker",
    },
  ],
  [
    {
      date: new Date("2020-10-22T20:00:00Z"),
      title: "First talk title",
      speaker: "First speaker",
    },
    {
      date: new Date("2020-10-22T21:00:00Z"),
      title: "Second talk title",
      speaker: "Second speaker",
    },
  ],
];

const Talks = () => <section>
  <div className="bigTalk">This is the big talk caroussel</div>
</section>;

export default Talks;
