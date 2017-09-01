import "./styles";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Link } from "react-router";
import { connect } from "react-redux";
import { isEmpty, filter, map, groupBy } from "lodash";

//
// components
import { Tabs, Tab, Panel } from "uikit/tabs";
import { Button } from "uikit";

//
// redux
import { fetchStats } from "actions/admin/stats";
import { fetchUsersAdmin } from "actions/admin/users";
import { fetchVotingStatus, openVoting, closeVoting } from "actions/admin/voting_status";

export class Dashboard extends Component {

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(fetchStats());
    dispatch(fetchUsersAdmin());
    dispatch(fetchVotingStatus());
  }

  toggleVotingStatus = () => {
    const { votingStatus, dispatch } = this.props;

    dispatch(votingStatus ? closeVoting() : openVoting());
  }

  render() {
    if (isEmpty(this.props.stats)) return null;

    const { stats: { users, teams, workshops, projects }, votingStatus } = this.props;
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

                <div className="section fullwidth">
                  <h2>Workshop Presences</h2>

                  <table className="stats">
                    <tbody>
                      {workshops.map(({ slug, name, participants }) => (
                        <tr key={slug}>
                          <td>NaN / {participants}</td>
                          <td><Link to={`/admin/checkin/workshop/${slug}`}>{name}</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>

                <div className="section fullwidth">
                  <h2>
                    <Link to="/admin/paper-votes">Paper Votes</Link>
                  </h2>

                  <ul className="unredeemed-paper-votes">
                    <li><h2>Unredeemed paper votes</h2></li>
                    {map(groupBy(votingStatus.unredeemed_paper_votes, "category_name"), (votes, category) => (
                      <li>
                        {category}: {votes.length}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="section fullwidth">
                  <h2>Voting: {votingStatus.voting_status}</h2>

                  <Button
                    primary
                    danger={votingStatus.voting_status === "started"}
                    disabled={votingStatus.voting_status === "ended"}
                    large
                    onClick={this.toggleVotingStatus}
                  >
                    {votingStatus === "not_started" ? "Open voting" : "Close voting"}
                  </Button>

                  <div>
                    <ul className="missing-voters">
                      <li><h2>Missing Voters</h2></li>

                      {votingStatus.missing_voters.map(({ team, users }) => (
                        <li key={team.id}>
                          <h3>Team: {team.name}</h3>
                          <ul>
                            {users.map(user => (
                              <li key={user.id}>{user.display_name}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>

                  </div>
                </div>

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

  connect(({ admin: { stats, users, votingStatus } }) => ({ stats, users, votingStatus })),
)(Dashboard);
