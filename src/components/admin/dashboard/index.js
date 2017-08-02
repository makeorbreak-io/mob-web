import "./styles";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Link } from "react-router";
import { connect } from "react-redux";
import { isEmpty } from "lodash";

//
// redux
import { fetchStatsAdmin } from "actions/admin/stats";

export class Dashboard extends Component {

  componentDidMount() {
    this.props.dispatch(fetchStatsAdmin());
  }

  render() {
    if (isEmpty(this.props.stats)) return null;

    const { stats: { users, teams } } = this.props;

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
                <span className="number">{teams.total}</span> teams
              </div>
            </div>

            {/*
            <div className="section">
              <h2><Link to="/admin/projects">Projects</Link></h2>

              <div className="stat">
                <span className="number">18</span> total projects
              </div>

              <div className="stat">
                <span className="number">10</span> accepted projects
              </div>

              <div className="stat">
                <span className="number">8</span> submitted projects
              </div>
            </div>
            */}

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
