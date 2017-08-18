import "./styles";

import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import ReactMarkdown from "react-markdown";

export const Workshop = ({
  workshop,
  showSummary,
  showDescription,
  showSpeaker,
  debug,
}) => {
  return (
    <div className="Workshop">
      <h2>{workshop.name}</h2>

      {showSummary && debug && <h6>Summary</h6>}
      {showSummary && <ReactMarkdown source={workshop.summary} />}

      {showDescription && debug && <h6>Description</h6>}
      {showDescription && <ReactMarkdown source={workshop.description} />}

      {showSpeaker && debug && <h6>Speaker</h6>}
      {showSpeaker && <ReactMarkdown source={workshop.speaker} />}

      <div className="actions"></div>
    </div>
  );
};

export default compose(
  setDisplayName("Workshop"),

  setPropTypes({
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
)(Workshop);
