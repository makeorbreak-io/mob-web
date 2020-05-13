import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import ReactMarkdown from "react-markdown";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

//
// gql
import { event } from "fragments";
import { withCurrentUser, waitForData } from "enhancers";

//
// components
import { Button, ErrorMessage } from "components/uikit";

export class Event extends Component {

  state = {
    showForm: false,
    disclaimer1: false,
    disclaimer2: false,
    updating: false,
  }

  //----------------------------------------------------------------------------
  // Event handlers
  //----------------------------------------------------------------------------

  toggleAttendance = (e) => {
    e.preventDefault();

    const { event: { slug }, data, joinEvent, leaveEvent } = this.props;

    const func = this.inEvent() ? leaveEvent : joinEvent;

    this.setState({
      updating: true,
      disclaimer1: false,
      disclaimer2: false,
    });

    return func({ variables: { slug } })
    .then(() => data.refetch())
    .finally(() => this.setState({ updating: false, showForm: false }));
  }

  showForm = () => {
    this.setState({ showForm: true }, () => {
      const { parentElement } = this.container;

      if (parentElement) parentElement.scrollTop = parentElement.scrollHeight;
    });
  }

  inEvent = () => {
    const { data: { me }, event: { slug } } = this.props;
    return me && me.events.map(w => w.slug).includes(slug);
  }

  limitReached = () => {
    const { data: { me } } = this.props;
    return me && me.currentTeam && me.currentTeam.applied && me.events.length >= 2;
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {

    const {
      data: { me },
      event,
      showSummary,
      showDescription,
      showSpeaker,
      debug,
    } = this.props;

    if (!event) return null;

    const { name, summary, description, speaker, attendances, participantLimit, bannerImage } = event;

    const { updating, showForm, disclaimer1, disclaimer2 } = this.state;

    const inEvent = this.inEvent();
    const spotsRemaining = attendances.length < participantLimit;
    const limitReached = this.limitReached();
    const canJoin = (spotsRemaining && !inEvent && !limitReached && disclaimer1 && disclaimer2) || inEvent;

    const formCx = classnames("actions", {
      hidden: !showForm && !inEvent,
    });

    const checkboxCx = classnames("checkbox", {
      hidden: inEvent,
    });

    return (
      <div className="Event" ref={ref => this.container = ref}>
        {bannerImage &&
          <div className="banner" style={{ backgroundImage: `url(${bannerImage})`}}/>
        }
        <h2>
          {name}
          {inEvent && <span className="attending-badge">You're in!</span>}
        </h2>

        {showSummary && debug && <h6>Summary</h6>}
        {showSummary && summary && <ReactMarkdown source={summary} />}

        {showDescription && debug && <h6>Description</h6>}
        {showDescription && description && <ReactMarkdown source={description} />}

        {showSpeaker && debug && <h6>Speaker</h6>}
        {showSpeaker && speaker && <ReactMarkdown source={speaker} />}

        {me && !inEvent && !showForm &&
          <Button fakelink primary centered onClick={this.showForm}>
            I want to participate in this event
          </Button>
        }

        {!me &&
          <div className="actions">
            <Link to="signup" className="signup">
              <Button primary centered>
                Sign up to attend this event
              </Button>
            </Link>
          </div>
        }

        <form className={formCx} onSubmit={this.toggleAttendance}>
          <label className={checkboxCx}>
            <span className="required">*</span>
            <input type="checkbox" id="disclaimer1" name="disclaimer1" checked={disclaimer1} onChange={e => this.setState({ disclaimer1: e.target.checked })} />
            <span>I am committing to attend this event and will do everything in my power to do so</span>
          </label>

          <label className={checkboxCx}>
            <span className="required">*</span>
            <input type="checkbox" id="disclaimer2" name="disclaimer2" checked={disclaimer2} onChange={e => this.setState({ disclaimer2: e.target.checked })} />
            <span>I will give up my spot in the event as soon as possible if for some reason I can't make it</span>
          </label>

          <Button
            type="submit"
            primary={!inEvent}
            danger={inEvent}
            centered
            disabled={updating || debug || !canJoin}
            loading={updating }
            confirmation={inEvent ? "Really leave event?" : null}
          >
            {!inEvent ? "Join event" : "Leave event"}
          </Button>
          <ErrorMessage form="joinEvent" field="disclaimer" />

          {limitReached && <p>As a hackathon participant, you are limited to attending 2 events</p>}
          {inEvent && <p>You are registered in this event. </p>}
          {!spotsRemaining && <p>Event is full</p>}
          {spotsRemaining && <p>Remaining spots: {participantLimit - attendances.length} of {participantLimit}</p>}

          {!inEvent &&
            <p className="notice">
              Our events are fun to prepare, and a lot of work.
              This means we need to know in advance how many people will be participating.
              Because there's limited availability, please don't register unless you're sure you can attend.
            </p>
          }
        </form>

      </div>
    );
  }
}

export default compose(
  setDisplayName("Event"),

  setPropTypes({
    event        : PropTypes.object,
    showSummary     : PropTypes.bool.isRequired,
    showDescription : PropTypes.bool.isRequired,
    showSpeaker     : PropTypes.bool.isRequired,
    debug           : PropTypes.bool.isRequired,
  }),

  defaultProps({
    showSummary     : false,
    showDescription : false,
    showSpeaker     : false,
    debug           : false,
  }),

  graphql(
    gql`mutation joinEvent($slug: String!) {
      joinEvent(slug: $slug) { ...event }
    } ${event}`,
    { name: "joinEvent" },
  ),

  graphql(
    gql`mutation leaveEvent($slug: String!) {
      leaveEvent(slug: $slug) { ...event }
    } ${event}`,
    { name: "leaveEvent" },
  ),

  withCurrentUser,
  waitForData,
)(Event);
