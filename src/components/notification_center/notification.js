import React from "react";
import { compose, setDisplayName } from "recompose";

//
// Util
import { linkedMessage } from "util/notifications";

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
)(Notification);
