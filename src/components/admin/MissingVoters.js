import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Link } from "react-router-dom";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

//
// gql
import { fullUser } from "fragments";
import { waitForData } from "enhancers";

//
// components
import { DataTable } from "components/uikit";

export class AdminMissingVoters extends Component {

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const users = this.props.data.missingVoters;

    return (
      <div className="AdminMissingVoters">
        <div className="content white">
          <div className="tools">
            <span className="left"><Link to="/admin">← Back to Admin</Link></span>
          </div>

          <DataTable
            source={users}
            search={[ "displayName" , "currentTeam.name" ]}
            labels={[ "Name"        , "Team" ]}
            sorter={[ "displayName" , "currentTeam.name" ]}
            filter={[ null          , null ]}
            render={user => (
              <tr key={user.id}>
                <td>{user.displayName}</td>
                <td>{user.currentTeam && user.currentTeam.name}</td>
              </tr>
            )}
          />
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("AdminMissingVoters"),

  graphql(gql`{
    missingVoters { ...fullUser }
  } ${fullUser}`),

  graphql(
    gql`mutation makeAdmin($id: String!) {
      makeAdmin(id: $id) { ...fullUser }
    } ${fullUser}`,
    { name: "makeAdmin" }
  ),

  graphql(
    gql`mutation makeParticipant($id: String!) {
      makeParticipant(id: $id) { ...fullUser }
    } ${fullUser}`,
    { name: "makeParticipant" }
  ),

  graphql(
    gql`mutation removeUser($id: String!) {
      removeUser(id: $id)
    } ${fullUser}`,
    { name: "removeUser" }
  ),

  waitForData,
)(AdminMissingVoters);
