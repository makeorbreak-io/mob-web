import "./styles";
import "./styles.responsive";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import ReactMarkdown from "react-markdown";
import { isEmpty, includes, map } from "lodash";
import { connect } from "react-redux";
import classnames from "classnames";
import { Link } from "react-router";

//
// components
import { Button, ErrorMessage } from "uikit";

//
// redux
import { joinWorkshop, leaveWorkshop } from "actions/workshops";

export class Workshop extends Component {

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

    const { dispatch, workshop: { slug }, currentUser } = this.props;

    const inWorkshop = !isEmpty(currentUser) && includes(map(currentUser.workshops, "slug"), slug);
    const func = !inWorkshop ? joinWorkshop : leaveWorkshop;

    this.setState({
      updating: true,
      disclaimer1: false,
      disclaimer2: false,
    });
    return dispatch(func(slug))
    .finally(() => this.setState({ updating: false, showForm: false }));
  }

  showForm = () => {
    this.setState({ showForm: true }, () => {
      const { parentElement } = this.container;

      if (parentElement) parentElement.scrollTop = parentElement.scrollHeight;
    });
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {

    const {
      currentUser,
      workshop,
      workshop: { name, slug, summary, description, speaker, participants, participant_limit, banner_image },
      showSummary,
      showDescription,
      showSpeaker,
      debug,
    } = this.props;

    const { updating, showForm, disclaimer1, disclaimer2 } = this.state;

    const inWorkshop = !isEmpty(currentUser) && includes(map(currentUser.workshops, "slug"), slug);
    const spotsRemaining = participants < participant_limit;
    const canJoin = (spotsRemaining && !inWorkshop && disclaimer1 && disclaimer2) || inWorkshop;


    const formCx = classnames("actions", {
      hidden: (!showForm || isEmpty(workshop) || isEmpty(currentUser)) && !inWorkshop,
    });

    const checkboxCx = classnames({
      hidden: inWorkshop,
    });

    return (
      <div className="Workshop" ref={ref => this.container = ref}>
        {banner_image &&
          <div className="banner" style={{ backgroundImage: `url(${banner_image})`}}/>
        }
        <h2>
          {name}
          {inWorkshop && <span className="attending-badge">You're in!</span>}
        </h2>

        {showSummary && debug && <h6>Summary</h6>}
        {showSummary && summary && <ReactMarkdown source={summary} />}

        {showDescription && debug && <h6>Description</h6>}
        {showDescription && description && <ReactMarkdown source={description} />}

        {showSpeaker && debug && <h6>Speaker</h6>}
        {showSpeaker && speaker && <ReactMarkdown source={speaker} />}

        {!isEmpty(workshop) && currentUser && !inWorkshop && !showForm &&
          <Button fakelink primary centered onClick={this.showForm}>
            I want to participate in this workshop
          </Button>
        }

        {!isEmpty(workshop) && !currentUser &&
          <div className="actions">
            <Link to="signup" className="signup">
              <Button primary centered>
                Sign up to attend this workshop
              </Button>
            </Link>
          </div>
        }

        <form className={formCx} onSubmit={this.toggleAttendance}>
          <label className={checkboxCx}>
            <span className="required">*</span>
            <input type="checkbox" id="disclaimer1" name="disclaimer1" checked={disclaimer1} onChange={e => this.setState({ disclaimer1: e.target.checked })} />
            I am committing to attend this workshop and will do everything in my power to do so
          </label>

          <label className={checkboxCx}>
            <span className="required">*</span>
            <input type="checkbox" id="disclaimer2" name="disclaimer2" checked={disclaimer2} onChange={e => this.setState({ disclaimer2: e.target.checked })} />
            I will leave the workshop as soon as possible if for some reason I can't make it
          </label>

          <Button
            type="submit"
            primary={!inWorkshop}
            danger={inWorkshop}
            centered
            disabled={updating || debug || !canJoin}
            loading={updating }
            confirmation={inWorkshop ? "Really leave workshop?" : null}
          >
            {!inWorkshop ? "Join workshop" : "Leave workshop"}
          </Button>
          <ErrorMessage form="joinWorkshop" field="disclaimer" />

          <p>
            {inWorkshop && <span>You are registered in this workshop. </span>}
            {!spotsRemaining && <span>Workshop is full</span>}
            {spotsRemaining && <span>Remaining spots: {participant_limit - participants} of {participant_limit}</span>}
          </p>

          {!inWorkshop &&
            <p className="notice">
              Our workshops are fun to prepare, and a lot of work.
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
