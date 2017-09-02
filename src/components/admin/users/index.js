import "./styles";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";
import { filter } from "lodash";
import moment from "moment";

//
// components
import { DataTable, Avatar, Button, Modal } from "uikit";

//
// redux
import { fetchUsersAdmin, deleteUserAdmin, setUserRoleAdmin } from "actions/admin/users";

//
// constants
import { ADMIN, PARTICIPANT } from "constants/roles";

//
// utils
import { toCSV } from "util/users";

//
// assets
import github from "assets/images/github-grey.svg";
import twitter from "assets/images/twitter-grey.svg";
import linkedin from "assets/images/linkedin-grey.svg";

const MODAL_CSV_ALL_USERS = "MODAL_CSV_ALL_USERS";
const MODAL_CSV_NO_TEAM_USERS = "MODAL_CSV_NO_TEAM_USERS";

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

    this.props.dispatch(setUserRoleAdmin(user.id, role));
  }

  removeUser = (id) => {
    this.props.dispatch(deleteUserAdmin(id));
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

    return (
      <div className="AdminUsers">

        <div className="tools">
          <h3>CSV Lists:</h3>
          <Button primary onClick={() => this.openModal(MODAL_CSV_ALL_USERS)}>
            All users
          </Button>

          <Modal
            title="All Users (CSV)"
            isOpen={openModal === MODAL_CSV_ALL_USERS}
            onRequestClose={this.closeModal}
          >
            <pre>{toCSV(users)}</pre>
          </Modal>

          <Button primary onClick={() => this.openModal(MODAL_CSV_NO_TEAM_USERS)}>
            Users without team / team not applied
          </Button>

          <Modal
            title="Users without team / team not applied (CSV)"
            isOpen={openModal === MODAL_CSV_NO_TEAM_USERS}
            onRequestClose={this.closeModal}
          >
            <pre>{toCSV(noTeamUsers)}</pre>
          </Modal>
        </div>

        <DataTable
          source={users}
          search={[ "display_name", "role", "tshirt_size" ]}
          labels={[ "Avatar" , "Name"         , "T-Shirt"     , "Role" , "Team" , "Social" , "Joined"      , "Actions" ]}
          sorter={[ null     , "display_name" , "tshirt_size" , "role" , "team" , null     , "inserted_at" , null ]}
          filter={[ null     , null           , null          , null   , null   , null     , null          , null ]}
          render={user => (
            <tr key={user.id}>
              <td><Avatar user={user} /></td>
              <td>{user.display_name}</td>
              <td>{user.tshirt_size}</td>
              <td>{user.role}</td>
              <td>{user.team && user.team.name}</td>
              <td className="social">
                {user.github_handle &&  <img src={github} title={user.github_handle} />}
                {user.twitter_handle && <img src={twitter} title={user.twitter_handle} />}
                {user.linkedin_url &&   <img src={linkedin} title={user.linkedin_url} />}
              </td>
              <td>{moment(user.inserted_at).format("DD/MM/YYYY")}</td>
              <td>
                <Button
                  primary
                  small
                  fullwidth
                  confirmation={`Really make ${user.display_name} a ${user.role === ADMIN ? "participant" : "admin"}?`}
                  onClick={() => this.toggleRole(user)}
                >
                  {user.role === ADMIN ? "Make participant" : "Make admin" }
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
