import "./styles";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";
import moment from "moment";

//
// components
import { DataTable, Avatar, Button } from "uikit";

//
// redux
import { fetchUsersAdmin, deleteUserAdmin, setUserRoleAdmin } from "actions/admin/users";

//
// constants
import { ADMIN, PARTICIPANT } from "constants/roles";

export class UserList extends Component {

  componentDidMount() {
    this.props.dispatch(fetchUsersAdmin());
  }

  toggleRole = (user) => {
    const role = user.role === ADMIN ? PARTICIPANT : ADMIN;

    this.props.dispatch(setUserRoleAdmin(user.id, role));
  }

  removeUser = (id) => {
    this.props.dispatch(deleteUserAdmin(id));
  }

  render() {
    const { users } = this.props;

    return (
      <div className="UserList">
        <DataTable
          source={users}
          search={[ "display_name", "role", "team.name" ]}
          labels={[ "Avatar" , "Name"         , "Role" , "Team" , "GitHub"        , "Twitter"        , "LinkedIn"     , "Joined"      , "Actions" ]}
          sorter={[ null     , "display_name" , "role" , "team" , "github_handle" , "twitter_handle" , "linkedin_url" , "inserted_at" , null ]}
          filter={[ null     , null           , null   , null   , null            , null             , null           , null          , null ]}
          render={user => (
            <tr key={user.id}>
              <td><Avatar user={user} /></td>
              <td>{user.display_name}</td>
              <td>{user.role}</td>
              <td>{user.team && user.team.name}</td>
              <td>{user.github_handle}</td>
              <td>{user.twitter_handle}</td>
              <td>{user.linkedin_url}</td>
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
  setDisplayName("UserList"),

  connect(({ admin: { users } }) => ({ users })),
)(UserList);
