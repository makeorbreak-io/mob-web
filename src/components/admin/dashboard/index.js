import "./styles";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Link } from "react-router";
import { connect } from "react-redux";
import { isEmpty, filter } from "lodash";

//
// components
import { Tabs, Tab, Panel } from "uikit/tabs";

//
// redux
import { fetchStats } from "actions/admin/stats";
import { fetchUsersAdmin } from "actions/admin/users";

export class Dashboard extends Component {

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(fetchStats());
    dispatch(fetchUsersAdmin());
  }

  render() {
    if (isEmpty(this.props.stats)) return null;

    const { stats: { users, teams, workshops, projects } } = this.props;
    const workshopOnlyUsers = filter(this.props.users, user => (
      ((!user.team) || (user.team && !user.team.applied)) && (user.workshops.length > 0)
    )).length;

    return (
      <div className="AdminDashboard">
        <div className="content">

          <Tabs>
            <Tab><span>Logistics</span></Tab>

            <Panel>
              <div className="Stats">

                <div className="section fullwidth">
                  <h2><Link to="/admin/checkin">Check In</Link></h2>

                  <table className="stats">
                    <tbody>
                      <tr>
                        <td>{users.checked_in}</td>
                        <td>Checked in participants</td>
                      </tr>
                      <tr>
                        <td>{users.hackathon + workshopOnlyUsers}</td>
                        <td>Total participants</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/*
                <div className="section fullwidth">
                  <h2>Workshop Presences</h2>

                  <table className="stats">
                    <tbody>
                      {workshops.map(({ slug, name, participants, participant_limit }) => (
                        <tr key={slug}>
                          <td>{participants} / {participant_limit}</td>
                          <td><Link to={`/admin/checkin/workshop/${slug}`}>{name}</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
                */}

              </div>
            </Panel>
          </Tabs>

          <Tabs>
            <Tab><span>Analytics</span></Tab>

            <Panel>
              <div className="Stats">

                <div className="section">
                  <h2><Link to="/admin/users">Users</Link></h2>

                  <table className="stats">
                    <tbody>
                      <tr>
                        <td>{users.hackathon}</td>
                        <td>hackathon participants</td>
                      </tr>
                      <tr>
                        <td>{workshopOnlyUsers}</td>
                        <td>workshop participants</td>
                      </tr>
                      <tr>
                        <td>{users.hackathon + workshopOnlyUsers}</td>
                        <td>total participants</td>
                      </tr>
                      <tr>
                        <td>{users.total}</td>
                        <td>total users</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="section">
                  <h2><Link to="/admin/teams">Teams</Link></h2>

                  <table className="stats">
                    <tbody>
                      <tr>
                        <td>{teams.applied}</td>
                        <td>confirmed teams</td>
                      </tr>
                      <tr>
                        <td>{teams.total}</td>
                        <td>total teams</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="section">
                  <h2><Link to="/admin/projects">Projects</Link></h2>

                  <table className="stats">
                    <tbody>
                      <tr>
                        <td>{projects.total}</td>
                        <td>projects</td>
                      </tr>
                    </tbody>
                  </table>
                </div>


                <div className="section fullwidth">
                  <h2>
                    <Link to="/admin/workshops">Workshops</Link>
                  </h2>

                  <table className="stats">
                    <tbody>
                      {workshops.map(({ slug, name, participants, participant_limit }) => (
                        <tr key={slug}>
                          <td>{participants} / {participant_limit}</td>
                          <td><Link to={`/admin/workshops/${slug}`}>{name}</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </Panel>
          </Tabs>

        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("Dashboard"),

  connect(({ admin: { stats, users } }) => ({ stats, users })),
)(Dashboard);
