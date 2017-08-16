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

//
// assets
import github from "assets/images/github-grey.svg";
import twitter from "assets/images/twitter-grey.svg";
import linkedin from "assets/images/linkedin-grey.svg";

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
          labels={[ "Avatar" , "Name"         , "Role" , "Team" , "Social" , "Joined"      , "Actions" ]}
          sorter={[ null     , "display_name" , "role" , "team" , null     , "inserted_at" , null ]}
          filter={[ null     , null           , null   , null   , null     , null          , null ]}
          render={user => (
            <tr key={user.id}>
              <td><Avatar user={user} /></td>
              <td>{user.display_name}</td>
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
  setDisplayName("UserList"),

  connect(({ admin: { users } }) => ({ users })),
)(UserList);
