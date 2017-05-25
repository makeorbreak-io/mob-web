import "./styles";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import { connect } from "react-redux";

//
// Components
import Editable from "./editable";
import Static from "./static";

//
// Redux
import { fetchProject } from "actions/projects";

export class Project extends Component {

  //----------------------------------------------------------------------------
  // Lifecycle
  //----------------------------------------------------------------------------
  componentWillMount() {
    this.requestProject(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const prevId = this.props.id;
    const { id } = nextProps;

    if (prevId !== id) this.requestProject(nextProps);
  }

  //----------------------------------------------------------------------------
  // Helpers
  //----------------------------------------------------------------------------
  requestProject = (props) => {
    const { id, dispatch } = props;

    if (id) return dispatch(fetchProject(id));
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { editable, team, project } = this.props;

    return editable
    ? <Editable {...{ team, project }} />
    : <Static {...{ team, project }} />;
  }

}

export default compose(
  setDisplayName("Project"),

  connect((state, props) => ({
    project: state.projects[props.id],
  })),

  setPropTypes({
    id: PropTypes.string,
    team: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
  }),

  defaultProps({
    editable: false,
  }),
)(Project);
