import "./styles";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Link } from "react-router";
import { connect } from "react-redux";
import { isEmpty } from "lodash";

//
// redux
import { fetchStats } from "actions/admin/stats";

export class Dashboard extends Component {

  componentDidMount() {
    this.props.dispatch(fetchStats());
  }

  render() {
    if (isEmpty(this.props.stats)) return null;

    const { stats: { users, teams, workshops, projects } } = this.props;

    return (
      <div className="AdminDashboard">
        <div className="content">
          <h1>Admin Dashboard</h1>

          <div className="Stats">

            <div className="section">
              <h2><Link to="/admin/users">Users</Link></h2>

              <div className="stat">
                <span className="number">{users.participants}</span> participants
              </div>
              <div className="stat">
                <span className="number">{users.total}</span> total users
              </div>
            </div>

            <div className="section">
              <h2><Link to="/admin/teams">Teams</Link></h2>

              <div className="stat">
                <span className="number">{teams.applied}</span> confirmed teams
              </div>
              <div className="stat">
                <span className="number">{teams.total}</span> total teams
              </div>
            </div>

            <div className="section">
              <h2><Link to="/admin/projects">Projects</Link></h2>

              <div className="stat">
                <span className="number">{projects.total}</span> projects
              </div>
            </div>


            <div className="section fullwidth">
              <h2>
                <Link to="/admin/workshops">Workshops</Link>
              </h2>

              <ul>
                {workshops.map(({ slug, name, participants, participant_limit }) => (
                  <li key={slug}>
                    <Link to={`/admin/workshops/${slug}`}>{name}</Link>
                    <span className="number wide">
                      {participants} / {participant_limit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>


          </div>
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("Dashboard"),

  connect(({ admin: { stats } }) => ({ stats })),
)(Dashboard);
