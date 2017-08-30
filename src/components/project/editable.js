import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";
import { Field, reduxForm } from "redux-form";
import { reduce, isString } from "lodash";

//
// Components
import {
  Button,
  ErrorMessage,
} from "uikit";
import { Multiselect } from "components/fields";

//
// Redux
import { createProject, updateProject } from "actions/projects";
import { fetchTeam } from "actions/teams";

//
// Constants
import technologies from "constants/technologies";

//
// Validation
import { composeValidators, validatePresence } from "validators";

const validate = (values) => {
  return composeValidators(
    validatePresence("name", "Project name"),
  )(values);
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
    const { dispatch, team } = this.props;

    const technologies = isString(values.technologies[0])
      ? values.technologies
      : values.technologies.map(t => t.value);

    return dispatch(createProject({ ...values, technologies })).then(dispatch(() => fetchTeam(team.id)));
  }

  updateProject = (values) => {
    const { dispatch, project, team } = this.props;

    const technologies = isString(values.technologies[0])
      ? values.technologies
      : values.technologies.map(t => t.value);

    return dispatch(updateProject(project.id, { ...values, technologies })).then(() => dispatch(fetchTeam(team.id)));
  }

  //---------------------------------------------------------------------------
  // Render
  //---------------------------------------------------------------------------
  render() {
    const { project, handleSubmit, submitting } = this.props;

    const submitHandler = project ? this.updateProject : this.createProject;
    const technologiesOptions = project
      ? [ ...technologies, ...reduce(project.technologies, (all, t) => ([ ...all, { label: t, value: t } ]), []) ]
      : technologies;

    return (
      <div className="Project editable">
        <form onSubmit={handleSubmit(submitHandler)}>
          <Field name="team_id" component="input" type="hidden" />

          <label htmlFor="name">Project</label>
          <Field name="name" component="input" type="text" placeholder="Name" className="fullwidth" />
          <ErrorMessage form="project" field="name" />

          <Field name="description" component="textarea" placeholder="Description" className="fullwidth" />
          <ErrorMessage form="project" field="description" />

          <Field name="technologies" component={Multiselect} creatable options={technologiesOptions} placeholder="Technologies..." />
          <ErrorMessage form="project" field="technologies" />

          <Button type="submit" form centered fullwidth primary disabled={submitting} loading={submitting}>
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
