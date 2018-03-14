import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps, mapProps } from "recompose";
import { filter } from "lodash";

import Editable from "components/TeamMembers.Editable";
import Static from "components/TeamMembers.Static";

export const TeamMembers = ({ editable, editing, team, members, invites }) => {
  return editable
  ? <Editable {...{ editing, team, members, invites }} />
  : <Static {...{ team, members, invites }} />;
};

export default compose(
  setDisplayName("TeamMembers"),

  setPropTypes({
    team: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
    editing: PropTypes.bool.isRequired,
  }),

  defaultProps({
    editable: false,
    editing: false,
  }),

  mapProps(({ team, ...props }) => ({
    members: filter(team.invites, { accepted: true }),
    invites: filter(team.invites, { accepted: false }),
    team,
    ...props,
  })),
)(TeamMembers);
