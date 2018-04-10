import React, { Component, Fragment } from "react";
import { compose, setDisplayName } from "recompose";
import { Link } from "react-router";
import { groupBy } from "lodash";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { parse, isToday } from "date-fns";

import { workshop } from "fragments";

import { waitForData } from "enhancers";

//
// components
import { Button } from "components/uikit";
import { Tabs, Tab, Panel } from "components/uikit/tabs";

const aiCompetitionDailyRuns = [
  { date: "2018-04-10", name: "day 1", templates: [ "ten_by_ten", "five_by_seven" ] },
  { date: "2018-04-11", name: "day 2", templates: [ "ten_by_ten", "five_by_seven" ] },
  { date: "2018-04-12", name: "day 3", templates: [ "ten_by_ten", "five_by_seven" ] },
  { date: "2018-04-13", name: "day 4", templates: [ "ten_by_ten", "five_by_seven" ] },
  { date: "2018-04-14", name: "day 5", templates: [ ] },
  { date: "2018-04-15", name: "day 6", templates: [ ] },
];

export class Dashboard extends Component {

  runAiGames = (name) => () => {
    return this.props.performRankedAiGames({ variables: { name } });
  }

  render() {
    const { adminStats: { users, teams }, workshops } = this.props.data;
    // const workshops = this.props.data.workshops.edges.map(e => e.node);

    return (
      <div className="AdminDashboard">
        <div className="content white">

          <Tabs>
            <Tab><span>Logistics</span></Tab>

            <Panel>
              <div className="Stats">
                <div className="section fullwidth">
                  <h2>AI Competition Daily Runs</h2>

                  <ul className="stats">
                    {aiCompetitionDailyRuns.map(run => (
                      <li key={run.name}>
                        <span>{run.date} - <code>{run.name}</code></span>
                        <span>templates: <code>{run.templates.join(", ")}</code></span>
                        <span>
                          <Button
                            primary
                            small
                            disabled={!isToday(parse(run.date))}
                            onClick={this.runAiGames(run.name)}
                          >
                            Run games
                          </Button>
                        </span>
                      </li>
                    ))}
                  </ul>

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
                        <td>&ndash;</td>
                        <td>workshop participants</td>
                      </tr>
                      <tr>
                        <td>{users.total}</td>
                        <td>total participants</td>
                      </tr>
                      <tr>
                        <td>&ndash;</td>
                        <td>checked in users</td>
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
                  <h2><Link to="/admin/bots">Bots</Link></h2>

                  <table className="stats">
                    <tbody>
                      {[1,2,3,4,5,6].map(day => (
                        <tr key={day}>
                          <td>day {day}</td>
                          <td><Link to={`admin/bots/${day}`}>View bots</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>


                <div className="section fullwidth">
                  <h2>
                    <Link to="/admin/workshops">Workshops</Link>
                  </h2>

                  <table className="stats">
                    <tbody>
                      {Object.entries(groupBy(workshops, "year")).map(([ year, workshops ]) => (
                        <Fragment key={year}>
                          <h2>{year}</h2>
                          {workshops.map(({ slug, name, attendances, participantLimit }) => (
                            <tr key={slug}>
                              <td>{attendances.length} / {participantLimit}</td>
                              <td><Link to={`/admin/workshops/${slug}`}>{name}</Link></td>
                            </tr>
                          ))}
                        </Fragment>
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

  graphql(
    gql`mutation performRankedAiGames($name: String!) {
      performRankedAiGames(name: $name)
    }`,
    { name: "performRankedAiGames" },
  ),

  graphql(gql`{
    adminStats {
      users
      roles
      teams
      workshops
    }

    workshops { ...workshop }
  } ${workshop}`),

  waitForData,
)(Dashboard);
