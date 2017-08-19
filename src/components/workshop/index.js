import "./styles";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import ReactMarkdown from "react-markdown";
import { isEmpty, includes, map } from "lodash";
import { connect } from "react-redux";

//
// components
import { Button } from "uikit";

//
// redux
import { joinWorkshop, leaveWorkshop } from "actions/workshops";

export class Workshop extends Component {

  state = {
    updating: false,
  }

  //----------------------------------------------------------------------------
  // Event handlers
  //----------------------------------------------------------------------------

  toggleAttendance = (inWorkshop) => {
    const { dispatch, workshop: { slug } } = this.props;
    const func = !inWorkshop ? joinWorkshop : leaveWorkshop;

    this.setState({ updating: true });
    dispatch(func(slug))
    .finally(() => this.setState({ updating: false }));
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {

    const {
      currentUser,
      workshop,
      workshop: { name, slug, summary, description, speaker, participants, participant_limit },
      showSummary,
      showDescription,
      showSpeaker,
      debug,
    } = this.props;

    const { updating } = this.state;

    const canJoin = participants < participant_limit;
    const inWorkshop = includes(map(currentUser.workshops, "slug"), slug);

    return (
      <div className="Workshop">
        <h2>
          {name}
          {inWorkshop && <span className="attending-badge">You're in</span>}
        </h2>

        {showSummary && debug && <h6>Summary</h6>}
        {showSummary && summary && <ReactMarkdown source={summary} />}

        {showDescription && debug && <h6>Description</h6>}
        {showDescription && description && <ReactMarkdown source={description} />}

        {showSpeaker && debug && <h6>Speaker</h6>}
        {showSpeaker && speaker && <ReactMarkdown source={speaker} />}

        {!isEmpty(workshop) && currentUser &&
          <div className="actions">
            <Button
              primary={!inWorkshop}
              danger={inWorkshop}
              centered
              onClick={() => this.toggleAttendance(inWorkshop)}
              disabled={updating || debug || !canJoin}
              disabled={false}
              loading={updating}
              confirmation={inWorkshop ? "Really leave workshop?" : null}
            >
              {!inWorkshop ? "Join workshop" : "Leave workshop"}
            </Button>

            <p>
              {inWorkshop && <span>You are registered in this workshop. </span>}
              {!inWorkshop && !canJoin && <span>Workshop is full</span>}
              <span>Remaining spots: {participant_limit - participants} of {participant_limit}</span>
            </p>
          </div>
        }
      </div>
    );
  }
}

export default compose(
  setDisplayName("Workshop"),

  setPropTypes({
    workshop        : PropTypes.object.isRequired,
    showSummary     : PropTypes.bool.isRequired,
    showDescription : PropTypes.bool.isRequired,
    showSpeaker     : PropTypes.bool.isRequired,
    debug           : PropTypes.bool.isRequired,
  }),

  defaultProps({
    workshop        : {},
    showSummary     : false,
    showDescription : false,
    showSpeaker     : false,
    debug           : false,
  }),

  connect(({ currentUser }) => ({ currentUser })),
)(Workshop);
