import React, { Component, Fragment } from "react";
import { compose, setDisplayName } from "recompose";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { last, every } from "lodash";

import { competition, fullUser } from "fragments";
import { withCompetitionSelector, waitForData } from "enhancers";
import { DataTable, CollapsibleContainer, Btn } from "components/uikit";

export class AdminCheckIn extends Component {
  componentDidMount() {
    const { data: { competitions }, competitionId, setCompetitionId } = this.props;
    if (!competitionId) setCompetitionId(competitions.find(c => c.isDefault).id);
  }

  toggleUserCheckin = ({ id }) => {
    const { toggleUserCheckin, data } = this.props;
    return toggleUserCheckin({ variables: { id }})
      .then(() => data.refetch());
  }

  renderActions = (selected) => (
    <Fragment>
      {every(selected, user => !user.currentAttendance.checkedIn) &&
        <Btn
          className="icon icon--small icon--check-circle"
          confirmation={`Really check in ${selected.length} users?`}
          onClick={() => selected.forEach(this.toggleUserCheckin)}
        >
          Check in {selected.length} users
        </Btn>
      }

      {every(selected, user => user.currentAttendance.checkedIn) &&
        <Btn
          className="icon icon--small icon--check-circle"
          confirmation={`Really check out ${selected.length} users?`}
          onClick={() => selected.forEach(this.toggleUserCheckin)}
        >
          Check out {selected.length} users
        </Btn>
      }
    </Fragment>
  )

  render() {
    const { data } = this.props;

    const attendees = data.competition.attendances.map(a => a.attendee);
    const users = data.users.edges.map(e => e.node).filter(user => attendees.includes(user.id));

    return (
      <div className="admin--teams">
        <DataTable
          filter
          source={users}
          labels={[ "Name"        , "Email" , "Role" , "Size" , "Workshops" , "Team"             , "GitHub" , "Checked in"]}
          mobile={[ true          , true    , true   , true   , false       , true               , true     , true]}
          sorter={[ "displayName" , "email" , "role" , null   , null        , "currentTeam.name" , null     , null]}
          search={[ "displayName", "role", "tshirtSize", "currentTeam.name"]}
          actions={this.renderActions}
          render={(user, select) => (
            <tr key={user.id} className={user.role}>
              {select}
              <td className="mobile">{user.displayName}</td>
              <td className="mobile">{user.email}</td>
              <td className="mobile">{user.role}</td>
              <td className="mobile">{user.tshirtSize}</td>
              <td className="desktop">
                <CollapsibleContainer
                  preview={`${user.workshops.length} workshops`}
                >
                  {user.workshops && user.workshops.map(({ slug }) => (
                    <div key={slug}>
                      <span className="tag purple">{slug}</span>
                    </div>
                  ))}
                </CollapsibleContainer>
              </td>
              <td className="mobile">{user.currentTeam && user.currentTeam.name}</td>
              <td className="github mobile">{last((user.githubHandle || "").split("/"))}</td>
              <td className="mobile">{user.currentAttendance && user.currentAttendance.checkedIn.toString()}</td>
            </tr>
          )}
        />
      </div>
    );
  }
}

export default compose(
  setDisplayName("AdminCheckIn"),

  withCompetitionSelector,

  graphql(gql`query checkIn($competitionId: String!) {
    users(first: 1000) { edges { node { ...fullUser } } }

    competition(id: $competitionId) {
      id
      attendances {
        id
        checkedIn
        attendee
      }
    }
  } ${fullUser} ${competition}`,
  {
    options: ({ competitionId }) => ({ variables: { competitionId }}),
  }),

  waitForData,

  graphql(
    gql`mutation toggleUserCheckin($id: String!) {
      toggleUserCheckin(id: $id) { ...fullUser }
    } ${fullUser}`,
    { name: "toggleUserCheckin" },
  ),
)(AdminCheckIn);
