import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import { get } from "lodash";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { fullTeam } from "fragments";

//
// Components
import Editable from "./Team.Editable";
import Static from "./Team.Static";

export const Team = ({ editable, data }) => {
  const team = get(data, "team", null);

  return editable ? <Editable team={team} /> : <Static team={team} />;
};

export default compose(
  setDisplayName("Team"),

  setPropTypes({
    id: PropTypes.string,
    editable: PropTypes.bool.isRequired,
  }),

  defaultProps({
    editable: false,
    id: null,
  }),

  graphql(
    gql`query team($id: String!) {
      team(id: $id) { ...fullTeam }
    } ${fullTeam}`,
    {
      skip: props => !props.id,
      options: props => ({
        variables: { id: props.id },
      }),
    },
  ),
)(Team);
