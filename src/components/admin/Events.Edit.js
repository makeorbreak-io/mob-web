import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, getContext } from "recompose";
import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { event } from "fragments";
import { waitForData } from "enhancers";

//
// components
import EventForm, { validate } from "components/admin/Events.Form";
import Event from "components/Event";
import { omit } from "lodash";

export class AdminEditEvent extends Component {

  state = {
    openModal: null,
  }

  //----------------------------------------------------------------------------
  // Lifecycle
  //----------------------------------------------------------------------------
  componentWillMount() {
    const { data: { event }, initialize } = this.props;

    initialize(omit(event, "__typename", "id", "users", "attendances"));
  }

  //----------------------------------------------------------------------------
  // Event Handlers
  //----------------------------------------------------------------------------
  updateEvent = (event) => {
    const { updateEvent, router } = this.props;

    return updateEvent({ variables: { slug: event.slug, event } })
    .then(response => {
      const { slug } = response.data.updateEvent;

      if (slug !== this.props.data.event.slug)
        router.push(`/admin/events/${slug}`);

      return null;
    });
  }

  deleteEvent = () => {
    const { deleteEvent, router, data: { event: { slug } } } = this.props;

    return deleteEvent({ variables: { slug } })
    .then(() => router.push("/admin/events"));
  }

  openModal = (id) => {
    this.setState({ openModal: id });
  }

  closeModal = () => {
    this.setState({ openModal: null });
  }

  //----------------------------------------------------------------------------
  // Event Handlers
  //----------------------------------------------------------------------------
  render() {
    const { data: { event }, formValues, handleSubmit, submitting, submitSucceeded } = this.props;

    return (
      <div className="admin--container admin--events--edit">
        <div>
          <h3>
            Edit event
          </h3>

          <EventForm
            {...{ handleSubmit, submitting, submitSucceeded }}
            buttonLabel="Update Event"
            form="editEvent"
            save={this.updateEvent}
            remove={this.deleteEvent}
          />
        </div>

        <div className="preview">
          <h1>Preview</h1>

          <Event
            event={{ ...event, ...formValues }}
            showSummary
            showDescription
            showSpeaker
            debug
          />
        </div>
      </div>
    );
  }
}

export default compose(
  setDisplayName("AdminEditEvent"),

  getContext({
    router: PropTypes.object.isRequired,
  }),

  reduxForm({
    form: "editEvent",
    validate,
  }),

  graphql(
    gql`query event($slug: String!) {
      event(slug: $slug) {
        ...event
        users { id name email }
      }
    } ${event}`,
    {
      skip: props => !props.params.slug,
      options: props => ({
        variables: { slug: props.params.slug },
      }),
    }
  ),

  waitForData,

  graphql(
    gql`mutation updateEvent($slug: String!, $event: EventInput!) {
      updateEvent(slug: $slug, event: $event) { ...event }
    } ${event}`,
    { name: "updateEvent" },
  ),

  graphql(
    gql`mutation deleteEvent($slug: String!) {
      deleteEvent(slug: $slug) { slug }
    }`,
    { name: "deleteEvent" },
  ),

  connect(({ form }) => ({
    formValues: form.editEvent.values || {},
  })),
)(AdminEditEvent);
