import React from "react";
import { Link, useLocation } from "react-router-dom";
import classnames from "classnames";

const sections = [
  { label: "Dashboard"     , icon: "dashboard"     , path: "/admin" },
  { label: "Editions"      , icon: "folder"        , path: "/admin/editions" },
  { label: "Users"         , icon: "person"        , path: "/admin/users" },
  { label: "Teams"         , icon: "group"         , path: "/admin/teams" },
  // { label: "Check-in"   , icon: "check"         , path: "/admin/checkin" },
  { label: "Voting"        , icon: "how-to-vote"   , path: "/admin/voting" },
  // { label: "AiEditions" , icon: "memory"        , path: "/admin/ai-editions" },
  { label: "Events"        , icon: "work"          , path: "/admin/events" },
  // { label: "Talks"      , icon: "speaker-group" , path: "/admin/talks" },
  { label: "Emails"        , icon: "email"         , path: "/admin/emails" },
];

export const Admin = ({
  children,
}) => {
  const location = useLocation();

  return (
    <div className="admin--wrapper">
      <div className="admin--navigation">
        <ul>
          {sections.map(({ label, path }) => (
            <li
              key={label}
              className={classnames({ active: location.pathname === path })}
            >
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
