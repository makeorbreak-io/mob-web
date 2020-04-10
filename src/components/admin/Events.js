import React, { Component, Fragment } from "react";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

//
// gql
import { event } from "fragments";
import { waitForData } from "enhancers";

//
// components
import EventForm, { validate } from "./Events.Form";
import { DataTable, Btn } from "components/uikit";
import Event from "components/Event";

export class AdminEvents extends Component {

  //----------------------------------------------------------------------------
  // Event Handlers
  //----------------------------------------------------------------------------
  createEvent = (event) => {
    const { data, createEvent, reset } = this.props;

    return createEvent({ variables: { event } })
    .then(() => {
      reset();
      data.refetch();
    });
  }

  renderActions = (selected) => (
    <Fragment>
      <Btn
          className="icon icon--small icon--delete"
          confirmation={`Really delete ${selected.length} users?`}
          onClick={() => selected.forEach(console.log)} // eslint-disable-line
      >
        Delete {selected.length} events
      </Btn>
    </Fragment>
  )

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { data: { events }, formValues, handleSubmit, submitting, submitSucceeded } = this.props;

    return (
      <div className="admin--container">
        <DataTable
          filter
          source={events}
          labels={[ "Year" , "Slug" , "Name" , "Date"      , "Signed Up" , "Limit" ]}
          sorter={[ "year" , "slug" , "name" , "shortDate" ]}
          search={[ "year" , "slug" , "name" ]}
          defaultSort="desc"
          actions={this.renderActions}
          render={(event, select) => (
            <tr key={event.id}>
              {select}
              <td>{event.year}</td>
              <td><Link to={`/admin/events/${event.slug}`}>{event.slug}</Link></td>
              <td>{event.name}</td>
              <td>{event.shortDate}</td>
              <td>{event.attendances.length}</td>
              <td>{event.participantLimit}</td>
            </tr>
          )}
        />

        <div className="admin--events--new">
          <div>
            <h3>Create new event</h3>
            <EventForm
              {...{ handleSubmit, submitting, submitSucceeded }}
              buttonLabel="Create Event"
              form="newEvent"
              save={this.createEvent}
            />
          </div>

          <div className="preview">
            <h3>Preview</h3>

            <Event
              event={{ ...formValues, attendances: [] }}
              showSummary
              showDescription
              showSpeaker
              debug
            />
          </div>
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("AdminEvents"),

  reduxForm({
    form: "newEvent",
    validate,
  }),

  connect(({ form }) => ({
    formValues: form.newEvent.values || {},
  })),

  graphql(gql`{ events {
    ...event
    users { id name email }
  } } ${event}`),

  waitForData,

  graphql(
    gql`mutation createEvent($event: EventInput!){
      createEvent(event: $event) { ...event }
    } ${event}`,
    { name: "createEvent"},
  )
)(AdminEvents);
