import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Link } from "react-router";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { last } from "lodash";

//
// gql
import { fullUser } from "fragments";
import { waitForData } from "enhancers";

//
// components
import { DataTable, Avatar, Button, Modal } from "components/uikit";

//
// constants
import { ADMIN } from "constants/roles";

//
// utils
import { toCSV, emailCSVSelector } from "lib/users";

//
// assets
import github from "assets/images/github-grey.svg";
import twitter from "assets/images/twitter-grey.svg";
import linkedin from "assets/images/linkedin-grey.svg";

const MODAL_CSV_ALL_USERS = "MODAL_CSV_ALL_USERS";
const MODAL_CSV_NO_TEAM_USERS = "MODAL_CSV_NO_TEAM_USERS";
const MODAL_CSV_PARTICIPATING_USERS = "MODAL_CSV_PARTICIPATING_USERS";
const MODAL_CRED_LIST_HACKATHON = "MODAL_CRED_LIST_HACKATHON";
const MODAL_CRED_LIST_WORKSHOPS = "MODAL_CRED_LIST_WORKSHOPS";

export class AdminUsers extends Component {

  state = {
    openModal: null,
  }

  //----------------------------------------------------------------------------
  // Event handlers
  //----------------------------------------------------------------------------
  toggleRole = (user) => {
    const { makeParticipant, makeAdmin, data } = this.props;
    const func = user.role === ADMIN ? makeParticipant : makeAdmin;

    return func({ variables: { id: user.id } })
    .then(() => data.refetch());
  }

  removeUser = (id) => {
    const { removeUser, data } = this.props;
    return removeUser({ variables: { id } })
    .then(() => data.refetch());
  }

  openModal = (modal) => {
    this.setState({ openModal: modal });
  }

  closeModal = () => {
    this.setState({ openModal: null });
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const users = this.props.data.users.edges.map(e => e.node);

    const { openModal } = this.state;

    const noTeamUsers = users.filter(user => user.currentTeam === null || user.currentTeam.applied === false);
    const participatingUsers = users.filter(user => ((user.currentTeam && user.currentTeam.applied) || (user.workshops.length > 0)));
    const hackathonUsers = users.filter(user => user.currentTeam && user.currentTeam.applied);
    const workshopOnlyUsers = users.filter(user => (user.workshops.length > 0 && (!user.currentTeam || (user.team && !user.currentTeam.applied))));

    return (
      <div className="AdminUsers">
        <div className="content white">
          <div className="tools">
            <span className="left"><Link to="/admin">← Back to Admin</Link></span>
          </div>
          <div className="tools">

            <h3>CSV Lists:</h3>
            <Button small primary onClick={() => this.openModal(MODAL_CSV_ALL_USERS)}>
              All users
            </Button>

            <Modal
              title="All Users (CSV)"
              isOpen={openModal === MODAL_CSV_ALL_USERS}
              onRequestClose={this.closeModal}
            >
              <pre>{toCSV(users, emailCSVSelector)}</pre>
            </Modal>

            <Button small primary onClick={() => this.openModal(MODAL_CSV_NO_TEAM_USERS)}>
              Users without team / team not applied
            </Button>

            <Modal
              title="Users without team / team not applied (CSV)"
              isOpen={openModal === MODAL_CSV_NO_TEAM_USERS}
              onRequestClose={this.closeModal}
            >
              <pre>{toCSV(noTeamUsers, emailCSVSelector)}</pre>
            </Modal>

            <Button small primary onClick={() => this.openModal(MODAL_CSV_PARTICIPATING_USERS)}>
              Participating Users
            </Button>

            <Modal
              title="Participating users (hackathon / workshops)"
              isOpen={openModal === MODAL_CSV_PARTICIPATING_USERS}
              onRequestClose={this.closeModal}
            >
              <pre>{toCSV(participatingUsers, emailCSVSelector)}</pre>
            </Modal>

            <Button small primary onClick={() => this.openModal(MODAL_CRED_LIST_HACKATHON)}>
              Hackathon users
            </Button>

            <Modal
              title="Hackathon users"
              isOpen={openModal === MODAL_CRED_LIST_HACKATHON}
              onRequestClose={this.closeModal}
            >
              <pre>{toCSV(hackathonUsers, [ ["Name", "displayName"], [ "Team", "team.name" ] ])}</pre>
            </Modal>

            <Button small primary onClick={() => this.openModal(MODAL_CRED_LIST_WORKSHOPS)}>
              Workshop users
            </Button>

            <Modal
              title="Workshop users"
              isOpen={openModal === MODAL_CRED_LIST_WORKSHOPS}
              onRequestClose={this.closeModal}
            >
              <code><pre>{toCSV(workshopOnlyUsers, [ ["Name", "displayName"] ])}</pre></code>
            </Modal>
          </div>

          <DataTable
            source={users}
            search={[ "displayName", "role", "tshirtSize", "currentTeam.name" ]}
            labels={[ ""       , "Name"        , "Email" , "Size" , "Workshops" , "Team" , "Social" , "Actions" ]}
            mobile={[ false    , true          , true    , true   , false       , true   , true     , true ]}
            sorter={[ null     , "displayName" , "email" , null   , null        , "currentTeam.name" , null     , null ]}
            filter={[ null     , null          , null    , null   , null        , null   , null     , null ]}
            render={user => (
              <tr key={user.id} className={user.role}>
                <td className="desktop avatar"><Avatar user={user} /></td>
                <td className="mobile">{user.displayName}</td>
                <td className="mobile">{user.email}</td>
                <td className="mobile">{user.tshirtSize}</td>
                <td className="desktop">
                  {user.workshops && user.workshops.map(({ slug }) => (
                    <div key={slug}>
                      <span className="tag purple">{slug}</span>
                    </div>
                  ))}
                </td>
                <td className="mobile">{user.currentTeam && user.currentTeam.name}</td>
                <td className="social mobile">
                  <ul>
                    {user.githubHandle &&  <li><img src={github} title={user.githubHandle} />{last(user.githubHandle.split("/"))}</li>}
                    {user.twitterHandle && <li><img src={twitter} title={user.twitterHandle} /></li>}
                    {user.linkedinUrl &&   <li><img src={linkedin} title={user.linkedinUrl} /></li>}
                  </ul>
                </td>
                <td className="mobile actions">
                  <Button
                    primary
                    small
                    fullwidth
                    disableFeedback
                    confirmation={`Really make ${user.displayName} a ${user.role === ADMIN ? "participant" : "admin"}?`}
                    onClick={() => this.toggleRole(user)}
                  >
                    {user.role === ADMIN ? "Make participant" : "⚠️ Make admin ⚠️" }
                  </Button>

                  <Button
                    danger
                    small
                    fullwidth
                    confirmation={`Really delete ${user.displayName}?`}
                    onClick={() => this.removeUser(user.id)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            )}
          />
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("AdminUsers"),

  graphql(gql`{
    users(first: 1000) { edges { node { ...fullUser } } }
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
)(AdminUsers);
