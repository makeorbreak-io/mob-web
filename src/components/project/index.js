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
    const { dispatch, id } = this.props;

    if (id) dispatch(fetchProject(id));
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { editable, project, id } = this.props;

    return editable
    ? <Editable {...{ id, project }} />
    : <Static {...{ id, project }} />;
  }

}

export default compose(
  setDisplayName("Project"),

  connect((state, props) => ({
    project: state.projects[props.id],
  })),

  setPropTypes({
    id: PropTypes.string,
    editable: PropTypes.bool.isRequired,
  }),

  defaultProps({
    editable: false,
  }),
)(Project);
