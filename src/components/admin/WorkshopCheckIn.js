import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Link } from "react-router";
import { connect } from "react-redux";
import { isEmpty, orderBy } from "lodash";

//
// components
import { DataTable, Button } from "components/uikit";

//
// redux
import {
  fetchWorkshops,
  confirmPresenceInWorkshop,
  removePresenceFromWorkshop,
} from "actions/workshops";

export class WorkshopCheckIn extends Component {

  componentDidMount() {
    this.props.dispatch(fetchWorkshops({ admin: true }));
  }

  toggleWorkshopCheckIn = (workshop, user) => {
    const { dispatch } = this.props;

    return user.checked_in
    ? dispatch(removePresenceFromWorkshop(workshop.slug, user.id))
    : dispatch(confirmPresenceInWorkshop(workshop.slug, user.id));
  }

  render() {
    const { workshops, params: { slug } } = this.props;
    if (isEmpty(workshops)) return <div>Loading...</div>;

    const workshop = workshops[slug];

    return (
      <div className="WorkshopCheckIn">
        <div className="tools">
          <span className="left"><Link to="/admin">← Back to Admin</Link></span>
        </div>

        <h1>Check-In: {workshop.name}</h1>

        <DataTable
          source={orderBy(workshop.attendees, [ "display_name" ], [ "asc" ])}
          search={[ "display_name", "email" ]}
          labels={[ "Name"         , "Email" , "Actions" ]}
          sorter={[ "display_name" , null    , null ]}
          mobile={[ true           , false   , true ]}
          render={user => (
            <tr key={user.id} className={user.role}>
              <td className="mobile">{user.display_name}</td>
              <td className="desktop">{user.email}</td>
              <td className="mobile">
                <Button
                  primary={!user.checked_in}
                  danger={user.checked_in}
                  small
                  onClick={() => this.toggleWorkshopCheckIn(workshop, user)}
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
  setDisplayName("WorkshopCheckIn"),

  connect(({ workshops }) => ({ workshops })),
)(WorkshopCheckIn);

