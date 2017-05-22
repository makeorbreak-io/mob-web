import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Field, reduxForm } from "redux-form";

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
//

export class EditableProject extends Component {

  //---------------------------------------------------------------------------
  // Lifecycle
  //---------------------------------------------------------------------------
  componentWillMount() {
    const { initialize, project } = this.props;

    initialize(project);
  }

  componentWillReceiveProps(nextProps) {
    const { initialize, project } = nextProps;

    if (!this.props.project && nextProps.project) initialize(project);
  }

  //---------------------------------------------------------------------------
  // Callbacks
  //---------------------------------------------------------------------------
  createProject = (values) => {
    const { dispatch, id } = this.props;

    return dispatch(createProject(id, values));
  }

  updateProject = (values) => {
    const { dispatch, id } = this.props;

    return dispatch(updateProject(id, values));
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
          <Field name="name" component="input" type="text" placeholder="Name" className="fullwidth" />
          <ErrorMessage form="project" field="name" />

          <Field name="description" component="textarea" placeholder="Description" className="fullwidth" />
          <ErrorMessage form="project" field="description" />

          <Field name="technologies" component="input" type="text" placeholder="Technologies" className="fullwidth" />
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
)(EditableProject);
