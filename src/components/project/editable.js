import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";
import { Field, reduxForm } from "redux-form";
import { isArray } from "lodash";

//
// Components
import {
  Button,
  ErrorMessage,
} from "uikit";

//
// Redux
import { createProject, updateProject } from "actions/projects";

//
// Validation
import { composeValidators, validatePresence } from "validators";

const validate = (values) => {
  return composeValidators(
    validatePresence("name", "Project name"),
    validatePresence("description", "Description"),
    validatePresence("technologies", "Technologies"),
  )(values);
};

//
// Technologies normalization and parsing (string <-> string[])
const normalize = (value) => {
  const values = (value || "").split(/\s*,\s*/);
  return values;
};

const parse = (value) => {
  const arr = isArray(value) ? value : [value];
  return arr.join(", ");
};

export class EditableProject extends Component {

  //---------------------------------------------------------------------------
  // Lifecycle
  //---------------------------------------------------------------------------
  componentWillMount() {
    const { initialize, project, team } = this.props;

    initialize({ ...project, team_id: team.id });
  }

  componentWillReceiveProps(nextProps) {
    const { initialize, project, team } = nextProps;

    if (!this.props.project && nextProps.project) initialize({ ...project, team_id: team.id });
  }

  //---------------------------------------------------------------------------
  // Callbacks
  //---------------------------------------------------------------------------
  createProject = (values) => {
    return this.props.dispatch(createProject(values));
  }

  updateProject = (values) => {
    const { dispatch, project } = this.props;

    return dispatch(updateProject(project.id, values));
  }

  //---------------------------------------------------------------------------
  // Render
  //---------------------------------------------------------------------------
  render() {
    const { project, handleSubmit, submitting } = this.props;

    const submitHandler = project ? this.updateProject : this.createProject;

    return (
      <div className="Project editable">
        <form onSubmit={handleSubmit(submitHandler)}>
          <Field name="team_id" component="input" type="hidden" />

          <Field name="name" component="input" type="text" placeholder="Name" className="fullwidth" />
          <ErrorMessage form="project" field="name" />

          <Field name="description" component="textarea" placeholder="Description" className="fullwidth" />
          <ErrorMessage form="project" field="description" />

          <Field name="technologies" component="input" type="text" placeholder="Technologies (comma separated)" className="fullwidth" {...{ normalize, parse }} />
          <ErrorMessage form="project" field="technologies" />

          <label>
            <Field name="student_team" component="input" type="checkbox" placeholder="Student Team" className="fullwidth" />
            Student Team
          </label>

          <Button type="submit" form primary disabled={submitting} loading={submitting}>
            {project ? "Update Project" : "Create Project"}
          </Button>
        </form>
      </div>
    );
  }
}

export default compose(
  setDisplayName("EditableProject"),

  reduxForm({
    form: "project",
    validate,
  }),

  setPropTypes({
    project: PropTypes.object,
    team: PropTypes.object,
  }),
)(EditableProject);
