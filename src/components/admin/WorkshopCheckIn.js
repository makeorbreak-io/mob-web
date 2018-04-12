import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Link } from "react-router";
import { orderBy } from "lodash";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

//
// gql
import { workshop } from "fragments";
import { waitForData } from "enhancers";


//
// components
import { DataTable, Button } from "components/uikit";

export class WorkshopCheckIn extends Component {

  toggle = (userId, value) => () => {
    const { toggleWorkshopCheckin, data: { workshop: { slug } } } = this.props;

    return toggleWorkshopCheckin({ variables: { slug, userId, value } });
  }

  render() {
    const { workshop } = this.props.data;

    return (
      <div className="WorkshopCheckIn">
        <div className="content white">
          <div className="tools">
            <span className="left"><Link to="/admin">← Back to Admin</Link></span>
          </div>

          <h1>Check-In: {workshop.name}</h1>

          <DataTable
            source={orderBy(workshop.attendances, [ "user.displayName" ], [ "asc" ])}
            search={[ "user.displayName" , "user.email" ]}
            labels={[ "Name"             , "Email" , "Actions" ]}
            sorter={[ "user.displayName" , null    , null ]}
            mobile={[ true               , false   , true ]}
            render={attendance => {
              return (
                <tr key={attendance.user.id} className={attendance.user.role}>
                  <td className="mobile">{attendance.user.displayName}</td>
                  <td className="desktop">{attendance.user.email}</td>
                  <td className="mobile">
                    <Button
                      primary={!attendance.checkedIn}
                      danger={attendance.checkedIn}
                      small
                      onClick={this.toggle(attendance.user.id, !attendance.checkedIn)}
                      confirmation={attendance.checkedIn ? `Really remove check in for ${attendance.user.displayName}?` : null}
                    >
                      {attendance.checkedIn ? "⚠️ Check Out ⚠️" : "Check In"}
                    </Button>
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
  setDisplayName("WorkshopCheckIn"),

  graphql(
    gql`query workshop($slug: String!) {
      workshop(slug: $slug) {
        id
        name
        slug
        attendances {
          checkedIn
          user { id displayName email role }
        }
      }
    } ${workshop}`,
    {
      skip: props => !props.params.slug,
      options: props => ({
        variables: { slug: props.params.slug },
      }),
    },
  ),

  waitForData,

  graphql(
    gql`mutation toggleWorkshopCheckin($slug: String!, $userId: String!, $value: Boolean!) {
      toggleWorkshopCheckin(slug: $slug, userId: $userId, value: $value) {
        id
        slug
        name
        attendances {
          checkedIn
          user { id displayName email role }
        }
      }
    }`,
    { name: "toggleWorkshopCheckin" },
  )
)(WorkshopCheckIn);

