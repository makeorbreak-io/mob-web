import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Link } from "react-router";
import { filter, orderBy, last } from "lodash";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

//
// gql
import { fullUser } from "fragments";
import { waitForData } from "enhancers";

//
// components
import { DataTable, Button } from "components/uikit";

import { sortedWorkshops } from "lib/workshops";

export class CheckIn extends Component {

  toggleCheckIn = (userId) => () => {
    const { toggleUserCheckin } = this.props;

    return toggleUserCheckin({ variables: { userId } });
  }

  render() {
    const users = this.props.data.users.edges.map(e => e.node);

    const participatingUsers = filter(users, user => (user.currentTeam && user.currentTeam.applied) || (user.workshops).length > 0);

    return (
      <div className="CheckIn">
        <div className="content white">
          <div className="tools">
            <span className="left"><Link to="/admin">← Back to Admin</Link></span>
          </div>

          <DataTable
            source={orderBy(participatingUsers, [ "displayName" ], [ "asc" ])}
            search={[ "displayName"  , "email", "currentTeam.name" ]}
            labels={[ "Name"         , "Email" , "Size" , "Team" , "Workshops" , "GitHub" , "Actions" ]}
            headcx={[ null           , null    , null   , null   , "workshops" , null     , "actions" ]}
            sorter={[ "displayName"  , null    , null   , null   , null        , null     , null ]}
            render={user => {
              const checkedIn = (user.currentAttendance && user.currentAttendance.checkedIn) || false;

              return (
                <tr key={user.id} className={user.role}>
                  <td>{user.displayName}</td>
                  <td>{user.email}</td>
                  <td>{user.tshirtSize}</td>
                  <td>{user.currentTeam && user.currentTeam.name}</td>
                  <td>
                    {user.workshops && sortedWorkshops(user.workshops).map(({ slug }) => (
                      <div key={slug}>
                        <span className="tag purple">{slug}</span>
                      </div>
                    ))}
                  </td>
                  <td>{user.githubHandle && last(user.githubHandle.split("/"))}</td>
                  <td className="actions">
                    {user.currentAttendance &&
                      <Button
                        primary={!checkedIn}
                        danger={checkedIn}
                        small
                        disableFeedback
                        onClick={this.toggleCheckIn(user.id)}
                        confirmation={checkedIn ? `Really remove check in for ${user.displayName}?` : null}
                      >
                        {checkedIn ? "⚠️ Check Out ⚠️" : "Check In"}
                      </Button>
                    }
                  </td>
                </tr>
              );
            }}
          />
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("CheckIn"),

  graphql(gql`{
    users(first: 1000) { edges { node {
      ...fullUser
    } } }
  } ${fullUser}`),

  waitForData,

  graphql(
    gql`mutation toggleUserCheckin($userId: String!) {
      toggleUserCheckin(userId: $userId) { ...fullUser }
    } ${fullUser}`,
    { name: "toggleUserCheckin" },
  ),
)(CheckIn);
