import React, { Component } from "react";
import { compose } from "recompose";
import { Link } from "react-router";
import classnames from "classnames";

const sections = [
  { label: "Dashboard"      , icon: "dashboard"     , path: "/admin/dashboard" },
  { label: "Users"          , icon: "person"        , path: "/admin/users" },
  { label: "Teams"          , icon: "group"         , path: "/admin/teams" },
  { label: "Check-in"       , icon: "check"         , path: "/admin/checkin" },
  { label: "Competitions"   , icon: "folder"        , path: "/admin/competitions" },
  { label: "Voting"         , icon: "how-to-vote"   , path: "/admin/voting" },
  // { label: "AiCompetitions" , icon: "memory"        , path: "/admin/ai-competitions" },
  { label: "Workshops"      , icon: "work"          , path: "/admin/workshops" },
  // { label: "Talks"          , icon: "speaker-group" , path: "/admin/talks" },
  { label: "Emails"         , icon: "email"         , path: "/admin/emails" },
];

export class Admin extends Component {
  render() {
    return (
      <div className="admin--wrapper">
        <div className="admin--navigation">
          <ul>
            {sections.map(({ label, icon, path }) =>(
              <li
                key={label}
                className={classnames({ active: window.location.pathname.startsWith(path) })}
              >
                <span className={`icon icon--${icon}`} />
                <Link to={path}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="admin--content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default compose(
)(Admin);
