import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";

//
// util
import { gravatarUrl } from "lib/users";

export const Avatar = ({ user }) => {
  const url = gravatarUrl(user);

  return (
    <img data={url} type="image/jpeg" className="Avatar" />
  );
};

export default compose(
  setDisplayName("Avatar"),

  setPropTypes({
    user: PropTypes.shape({
      gravatar_hash: PropTypes.string,
    }).isRequired,
  }),
)(Avatar);
