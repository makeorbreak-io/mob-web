import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Link } from "react-router";
import { connect } from "react-redux";
import { filter, last } from "lodash";

//
// components
import { DataTable, Avatar, Button, Modal } from "components/uikit";

//
// redux
import { fetchUsersAdmin, deleteUserAdmin, setUserRoleAdmin } from "actions/admin/users";

//
// constants
import { ADMIN, PARTICIPANT } from "constants/roles";

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
  // Lifecycle
  //----------------------------------------------------------------------------
  componentDidMount() {
    this.props.dispatch(fetchUsersAdmin());
  }

  //----------------------------------------------------------------------------
  // Event handlers
  //----------------------------------------------------------------------------
  toggleRole = (user) => {
    const role = user.role === ADMIN ? PARTICIPANT : ADMIN;

    return this.props.dispatch(setUserRoleAdmin(user.id, role));
  }

  removeUser = (id) => {
    return this.props.dispatch(deleteUserAdmin(id));
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
    const { users } = this.props;
    const { openModal } = this.state;

    const noTeamUsers = filter(users, user => user.team === null || user.team.applied === false);
    const participatingUsers = filter(users, user => ((user.team && user.team.applied) || (user.workshops.length > 0)));
    const hackathonUsers = filter(users, user => user.team && user.team.applied);
    const workshopOnlyUsers = filter(users, user => (user.workshops.length > 0 && (!user.team || (user.team && !user.team.applied))));

    return (
      <div className="AdminUsers">

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
            <pre>{toCSV(hackathonUsers, [ ["Name", "display_name"], [ "Team", "team.name" ] ])}</pre>
          </Modal>

          <Button small primary onClick={() => this.openModal(MODAL_CRED_LIST_WORKSHOPS)}>
            Workshop users
          </Button>

          <Modal
            title="Workshop users"
            isOpen={openModal === MODAL_CRED_LIST_WORKSHOPS}
            onRequestClose={this.closeModal}
          >
            <pre>{toCSV(workshopOnlyUsers, [ ["Name", "display_name"] ])}</pre>
          </Modal>
        </div>

        <DataTable
          source={users}
          search={[ "display_name", "role", "tshirt_size", "team.name" ]}
          labels={[ "Avatar" , "Name"         , "Email" , "T-Shirt" , "Workshops" , "Team" , "Social" , "Actions" ]}
          mobile={[ false    , true           , true    , true      , false       , true   , true     , true ]}
          sorter={[ null     , "display_name" , "email" , null      , null        , "team" , null     , null ]}
          filter={[ null     , null           , null    , null      , null        , null   , null     , null ]}
          render={user => (
            <tr key={user.id} className={user.role}>
              <td className="desktop"><Avatar user={user} /></td>
              <td className="mobile">{user.display_name}</td>
              <td className="mobile">{user.email}</td>
              <td className="mobile">{user.tshirt_size}</td>
              <td className="desktop">
                {(user.workshops).map(({ slug }) => (
                  <div key={slug}>
                    <span className="tag purple">{slug}</span>
                  </div>
                ))}
              </td>
              <td className="mobile">{user.team && user.team.name}</td>
              <td className="social mobile">
                <ul>
                  {user.github_handle &&  <li><img src={github} title={user.github_handle} />{last(user.github_handle.split("/"))}</li>}
                  {user.twitter_handle && <li><img src={twitter} title={user.twitter_handle} /></li>}
                  {user.linkedin_url &&   <li><img src={linkedin} title={user.linkedin_url} /></li>}
                </ul>
              </td>
              <td className="mobile">
                <Button
                  primary
                  small
                  fullwidth
                  disableFeedback
                  confirmation={`Really make ${user.display_name} a ${user.role === ADMIN ? "participant" : "admin"}?`}
                  onClick={() => this.toggleRole(user)}
                >
                  {user.role === ADMIN ? "Make participant" : "⚠️ Make admin ⚠️" }
                </Button>

                <Button
                  danger
                  small
                  fullwidth
                  confirmation={`Really delete ${user.display_name}?`}
                  onClick={() => this.removeUser(user.id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          )}
        />
      </div>
    );
  }

}

export default compose(
  setDisplayName("AdminUsers"),

  connect(({ admin: { users } }) => ({ users })),
)(AdminUsers);
