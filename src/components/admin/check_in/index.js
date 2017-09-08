import "./styles";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Link } from "react-router";
import { connect } from "react-redux";
import { filter, orderBy, last } from "lodash";

//
// components
import { DataTable, Button } from "uikit";

//
// redux
import { fetchUsersAdmin, checkInUser, removeUserCheckIn } from "actions/admin/users";

const welcomePack = (user) => (
  <span className={`welcome-pack ${user.team && user.team.applied ? "green" : "orange"}`} />
);

export class CheckIn extends Component {

  componentDidMount() {
    this.props.dispatch(fetchUsersAdmin());
  }

  toggleCheckIn = (user) => {
    const { dispatch } = this.props;

    return user.checked_in
    ? dispatch(removeUserCheckIn(user.id))
    : dispatch(checkInUser(user.id));
  }

  render() {
    const { users } = this.props;
    const participatingUsers = filter(users, user => (user.team && user.team.applied) || (user.workshops || []).length > 0);

    return (
      <div className="CheckIn">
        <div className="tools">
          <span className="left"><Link to="/admin">← Back to Admin</Link></span>
        </div>

        <DataTable
          source={orderBy(participatingUsers, [ "display_name" ], [ "asc" ])}
          search={[ "display_name", "email", "team.name" ]}
          labels={[ "Name"         , "Email" , "T-shirt" , "Team" , "WP" , "GitHub" , "Actions" ]}
          sorter={[ "display_name" , null    , null      , null   , null , null     ,null ]}
          render={user => (
            <tr key={user.id} className={user.role}>
              <td>{user.display_name}</td>
              <td>{user.email}</td>
              <td>{user.tshirt_size}</td>
              <td>{user.team && user.team.name}</td>
              <td>{welcomePack(user)}</td>
              <td>{user.github_handle && last(user.github_handle.split("/"))}</td>
              <td>
                <Button
                  primary={!user.checked_in}
                  danger={user.checked_in}
                  small
                  onClick={() => this.toggleCheckIn(user)}
                  confirmation={user.checked_in ? `Really remove check in for ${user.display_name}?` : null}
                >
                  {user.checked_in ? "⚠️ Check Out ⚠️" : "Check In"}
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
  setDisplayName("CheckIn"),

  connect(({ admin: { users } }) => ({ users })),
)(CheckIn);
