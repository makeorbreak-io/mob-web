import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
// import { Link } from "react-router";
// import { groupBy } from "lodash";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
// import { parse, isToday } from "date-fns";

import { workshop } from "fragments";

import { waitForData } from "enhancers";

//
// components
// import { Button } from "components/uikit";
// import { Tabs, Tab, Panel } from "components/uikit/tabs";
// import { sortedWorkshops } from "lib/workshops";

// import AdminSuffrages from "components/admin/Suffrages";

export class Dashboard extends Component {

  runAiGames = (name) => () => {
    return this.props.performRankedAiGames({ variables: { name } });
  }

  render() {
    const { users } = this.props.data.adminStats;

    return (
      <div className="admin--container admin--dashboard">
        <div className="admin--dashboard--card">
          <div className="icon icon--person"/>
          <span>{users.total} Total users</span>
        </div>

        <div className="admin--dashboard--card">
          <div className="icon icon--person"/>
          <span>{users.hackathon} Hackathon users</span>
        </div>
      </div>
    );
    // const {
    //   adminStats: { users, teams },
    //   workshops,
    //   redeemedPaperVotes,
    //   unredeemedPaperVotes,
    // } = this.props.data;

    // return (
    //   <div className="AdminDashboard">
    //     <div className="content white">


    //       <Tabs>
    //         <Tab><span>Logistics</span></Tab>

    //         <Panel>
    //           <Button large danger onClick={this.props.sendGdprEmail}>Send GDPR email</Button>

    //           <div className="Stats">

    //             {/*------------------------------------------------------------ Check in */}
    //             <div className="section halfwidth">
    //               <h2><Link to="/admin/checkin">Check In</Link></h2>

    //               <table className="stats">
    //                 <tbody>
    //                   <tr>
    //                     <td>{users.checked_in}</td>
    //                     <td>Checked in participants</td>
    //                   </tr>
    //                   <tr>
    //                     <td>{users.total}</td>
    //                     <td>Total participants</td>
    //                   </tr>
    //                 </tbody>
    //               </table>
    //             </div>

    //             {/*------------------------------------------------------------ Workshops Check in */}
    //             <div className="section halfwidth">
    //               <h2>Workshop Presences</h2>

    //               <table className="stats">
    //                 <tbody>
    //                   {sortedWorkshops(workshops).map(({ slug, name, attendances }) => (
    //                     <tr key={slug}>
    //                       <td>{attendances.filter(a => a.checkedIn).length} / {attendances.length}</td>
    //                       <td><Link to={`/admin/checkin/workshop/${slug}`}>{name}</Link></td>
    //                     </tr>
    //                   ))}
    //                 </tbody>
    //               </table>

    //             </div>

    //             {/*------------------------------------------------------------ AI Competition daily runs */}
    //             <div className="section fullwidth">
    //               <h2><Link to="admin/ai-game-viewer">AI Competition Dedicated Viewer</Link></h2>
    //             </div>

    //             <div className="section fullwidth">
    //               <h2>AI Competition Daily Runs</h2>

    //               <ul className="stats">
    //                 {aiCompetitionDailyRuns.map(run => (
    //                   <li key={run.name}>
    //                     <span>{run.date} - <code>{run.name}</code></span>
    //                     <span>templates: <code>{run.templates.join(", ")}</code></span>
    //                     <span>
    //                       <Button
    //                         primary
    //                         small
    //                         disabled={!isToday(parse(run.date))}
    //                         onClick={this.runAiGames(run.name)}
    //                       >
    //                         Run games
    //                       </Button>
    //                     </span>
    //                   </li>
    //                 ))}
    //               </ul>

    //             </div>

    //             {/*------------------------------------------------------------ Voting categories / suffrages */}
    //             <div className="section two-thirds">
    //               <h2>Hackathon (<Link to="/admin/missing-voters">Missing voters</Link>)</h2>
    //               <AdminSuffrages />
    //             </div>

    //             {/*------------------------------------------------------------ Paper Votes */}
    //             <div className="section">
    //               <h2><Link to="/admin/paper-votes">Paper Votes</Link></h2>
    //               <table className="stats">
    //                 <tbody>
    //                   <tr>
    //                     <td>{redeemedPaperVotes.length + unredeemedPaperVotes.length}</td>
    //                     <td>total paper votes</td>
    //                   </tr>
    //                   <tr>
    //                     <td>{redeemedPaperVotes.length}</td>
    //                     <td>redeemed</td>
    //                   </tr>
    //                   <tr>
    //                     <td>{unredeemedPaperVotes.length}</td>
    //                     <td>unredeemed</td>
    //                   </tr>
    //                 </tbody>
    //               </table>
    //             </div>
    //           </div>
    //         </Panel>
    //       </Tabs>

    //       <Tabs>
    //         <Tab><span>Analytics</span></Tab>

    //         <Panel>
    //           <div className="Stats">

    //             <div className="section">
    //               <h2><Link to="/admin/users">Users</Link></h2>

    //               <table className="stats">
    //                 <tbody>
    //                   <tr>
    //                     <td>{users.hackathon}</td>
    //                     <td>hackathon participants</td>
    //                   </tr>
    //                   <tr>
    //                     <td>&ndash;</td>
    //                     <td>workshop participants</td>
    //                   </tr>
    //                   <tr>
    //                     <td>{users.total}</td>
    //                     <td>total participants</td>
    //                   </tr>
    //                   <tr>
    //                     <td>&ndash;</td>
    //                     <td>checked in users</td>
    //                   </tr>
    //                 </tbody>
    //               </table>
    //             </div>

    //             <div className="section">
    //               <h2><Link to="/admin/teams">Teams</Link></h2>

    //               <table className="stats">
    //                 <tbody>
    //                   <tr>
    //                     <td>{teams.applied}</td>
    //                     <td>confirmed teams</td>
    //                   </tr>
    //                   <tr>
    //                     <td>{teams.total}</td>
    //                     <td>total teams</td>
    //                   </tr>
    //                 </tbody>
    //               </table>
    //             </div>

    //             <div className="section">
    //               <h2><Link to="/admin/bots">Bots</Link></h2>

    //               <table className="stats">
    //                 <tbody>
    //                   {[1,2,3,4,5,6].map(day => (
    //                     <tr key={day}>
    //                       <td>day {day}</td>
    //                       <td><Link to={`admin/bots/${day}`}>View bots</Link></td>
    //                       <td><Link to={`admin/games/${day}`}>View games</Link></td>
    //                     </tr>
    //                   ))}
    //                 </tbody>
    //               </table>
    //             </div>


    //             <div className="section fullwidth">
    //               <h2>
    //                 <Link to="/admin/workshops">Workshops</Link>
    //               </h2>

    //               <table className="stats">
    //                 <tbody>
    //                   {Object.entries(groupBy(workshops, "year")).map(([ year, workshops ]) => (
    //                     <Fragment key={year}>
    //                       <tr>
    //                         <td colSpan="2"><h2>{year}</h2></td>
    //                       </tr>
    //                       {workshops.map(({ slug, name, attendances, participantLimit }) => (
    //                         <tr key={slug}>
    //                           <td>{attendances.length} / {participantLimit}</td>
    //                           <td><Link to={`/admin/workshops/${slug}`}>{name}</Link></td>
    //                         </tr>
    //                       ))}
    //                     </Fragment>
    //                   ))}
    //                 </tbody>
    //               </table>
    //             </div>

    //           </div>
    //         </Panel>
    //       </Tabs>

    //     </div>
    //   </div>
    // );
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

  graphql(
    gql`mutation {
      sendGdprEmail
    }`,
    { name: "sendGdprEmail" },
  ),

  graphql(gql`{
    adminStats {
      users
      roles
      teams
      workshops
    }

    workshops { ...workshop }

    unredeemedPaperVotes { id }
    redeemedPaperVotes { id }
  } ${workshop}`),

  waitForData,
)(Dashboard);
