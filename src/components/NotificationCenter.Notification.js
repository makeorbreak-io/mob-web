import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";

//
// Util
import { linkedMessage } from "lib/notifications";

export const Notification = ({
  title,
  message,
  link,
}) => {
  return (
    <div className="Notification">
      <div className="title">{title}</div>
      <div
        className="message"
        dangerouslySetInnerHTML={{ __html: linkedMessage(message, link) }}
      />
    </div>
  );
};

export default compose(
  setDisplayName("Notification"),

  setPropTypes({
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    link: PropTypes.string,
  }),
)(Notification);
