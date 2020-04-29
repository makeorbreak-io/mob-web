import React from "react";
import { BrowserRouter } from "react-router-dom";

import { DailyFilter } from "components/2020/uikit";

export default { title: "DailyFilter" };

const mockData = [
  {
    talks: [
      { title: "Ladders!", speaker: "Speaker Speakerson", date: new Date() },
      { title: "Spanish 101", speaker: "Señor Chang", date: new Date() },
      { title: "Madness 101", speaker: "Hugo Strange", date: new Date() },
      { title: "Gastronomy", speaker: "Smart Water", date: new Date() },
      {
        title: "Remedial Chaos Theory",
        speaker: "Malaquias Silva",
        date: new Date(),
      },
    ],
  },
  {
    talks: [
      { title: "Anthropology", speaker: "Betty White", date: new Date() },
      { title: "Psychology", speaker: "Ian Duncan", date: new Date() },
      {
        title: "Fundamentals of Law",
        speaker: "Jeff Winger",
        date: new Date(),
      },
    ],
  },
  {
    talks: [
      {
        title: "Introduction to Conspiracy Theories",
        speaker: "Professor Professorson",
        date: new Date(),
      },
      { title: "Learning!", speaker: "Name Mc Nameface", date: new Date() },
      {
        title: "I ran out of ideas so here goes a long one I hope",
        date: new Date(),
        speaker: "Bruce Wayne",
      },
    ],
  },
];

export const Regular = () => (
  <BrowserRouter>
    <div style={{ width: "100%", backgroundColor: "#fff" }}>
      <DailyFilter data={mockData} />
    </div>
  </BrowserRouter>
);
