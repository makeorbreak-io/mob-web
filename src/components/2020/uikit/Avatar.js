import React from "react";

//
// util
import { gravatarUrl } from "lib/users";

const Avatar = ({ user }) => (
  <img src={gravatarUrl(user)} className="avatar" />
);

export default Avatar;

