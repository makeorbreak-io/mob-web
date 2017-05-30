import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps, mapProps } from "recompose";
import { filter } from "lodash";

import Editable from "./editable";
import Static from "./static";

export const TeamMembers = ({ editable, team, members, invites }) => {
  return editable
  ? <Editable {...{ team, members, invites }} />
  : <Static {...{ team, members, invites }} />;
};

export default compose(
  setDisplayName("TeamMembers"),

  setPropTypes({
    team: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
  }),

  defaultProps({
    editable: false,
  }),

  mapProps(({ team, ...props }) => ({
    members: filter(team.invites, { accepted: true }),
    invites: filter(team.invites, { accepted: false }),
    team,
    ...props,
  })),
)(TeamMembers);
