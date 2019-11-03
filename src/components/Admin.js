import React from "react";
import { Link, useLocation } from "react-router-dom";
import classnames from "classnames";

const sections = [
  { label: "Dashboard"      , icon: "dashboard"     , path: "/admin" },
  { label: "Competitions"   , icon: "folder"        , path: "/admin/competitions" },
  { label: "Users"          , icon: "person"        , path: "/admin/users" },
  { label: "Teams"          , icon: "group"         , path: "/admin/teams" },
  // { label: "Check-in"       , icon: "check"         , path: "/admin/checkin" },
  { label: "Voting"         , icon: "how-to-vote"   , path: "/admin/voting" },
  // { label: "AiCompetitions" , icon: "memory"        , path: "/admin/ai-competitions" },
  { label: "Workshops"      , icon: "work"          , path: "/admin/workshops" },
  // { label: "Talks"          , icon: "speaker-group" , path: "/admin/talks" },
  { label: "Emails"         , icon: "email"         , path: "/admin/emails" },
];

export const Admin = ({
  children,
}) => {
  const location = useLocation();

  return (
    <div className="admin--wrapper">
      <div className="admin--navigation">
        <ul>
          {sections.map(({ label, icon, path }) => (
            <li
              key={label}
              className={classnames({ active: location.pathname === path })}
            >
              <span className={`icon icon--${icon}`} />
              <Link to={path}>{label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="admin--content">
        {children}
      </div>
    </div>
  );
};

export default Admin;
