import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { useEditionSelector } from "hooks";

import { STATS } from "queries/admin";

import {
  Heading,
  Section,
} from "components/2020/uikit";

export const DasboardCard = ({
  title,
  icon,
  items, // [ [left, right], [left, right], ... ]
}) => (
  <div className="admin--dashboard--card">
    <h2 className="header">
      {title}
      <div className={`icon icon--${icon}`} />
    </h2>
    <ul>
      {items.map(([left, right], i) => (
        <li key={i}>
          <span>{left}</span>
          <span>{right}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const AdminDashboard = () => {
  const { selectedEdition, EditionSelector } = useEditionSelector();
  const { data } = useQuery(STATS, { variables: { editionId: selectedEdition?.id }});

  if (!data) return null;

  const {
    adminStats: { events },
    edition: { attendances, teams, suffrages },
  } = data;

  return (
    <Section>
      <Heading size="xl">Stats</Heading>

      <EditionSelector />

      <div className="admin--dashboard">
        <DasboardCard
          title={`${attendances.length} Users`}
          icon="person"
          items={[
            ["Checked in", attendances.filter(a => a.checkedIn).length],
            ["With team", attendances.filter(a => a.user.currentTeam).length],
            ["Participants", attendances.filter(a => a.user.role === "participant").length],
          ]}
        />

        <DasboardCard
          title={`${teams.length} Teams`}
          icon="group"
          items={[
            ["Applied"  , teams.filter(t => t.applied).length],
            ["Accepted" , teams.filter(t => t.accepted).length],
            ["Eligible" , teams.filter(t => t.eligible).length],
          ]}
        />

        <DasboardCard
          title={`${suffrages.length} Categories`}
          icon="how-to-vote"
          items={suffrages.map(s => [`Teams up for ${s.name}`, s.teams.length])}
        />

        <DasboardCard
          title={`${events.length} Events`}
          icon="work"
          items={events.map(w => [w.name, `${w.participants} / ${w.participant_limit}`])}
        />
      </div>
    </Section>
  );
};

export default AdminDashboard;
