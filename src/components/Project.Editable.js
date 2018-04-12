import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";
import { Field, FieldArray, reduxForm } from "redux-form";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import ReactMarkdown from "react-markdown";
import { connect } from "react-redux";
import { getFormValues } from "redux-form";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

//
// gql
import { waitForData } from "enhancers";
import { fullTeam, fullUser } from "fragments";
import { handleGraphQLErrors } from "lib/graphql";

//
// Components
import {
  Button,
  buttonPropsFromReduxForm,
  ErrorMessage,
} from "components/uikit";

//
// Validation
import { composeValidators, validatePresence } from "validators";

const validate = (values) => {
  return composeValidators(
    validatePresence("projectName", "Project name"),
  )(values);
};

const template =
`Your project description goes here. You can use markdown to format it.

---

# h1 Heading
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading`;

const SortablePrize = SortableElement(({ value }) => (
  <li className={`prize ${value}`}>{value}</li>
));

const SortablePrizes = SortableContainer(({ fields, suffrageName }) => (
  <ul className="prize-preference">
    {fields.getAll().map((id, index) => (
      <SortablePrize key={index} index={index} value={suffrageName(id)} />
    ))}
  </ul>
));

export class EditableProject extends Component {

  state = {
    descriptionRows: 10,
  }

  //---------------------------------------------------------------------------
  // Lifecycle
  //---------------------------------------------------------------------------
  componentWillMount() {
    const { data: { me }, initialized } = this.props;
    if (me && !initialized) this.initForm(me.currentTeam || {});
  }

  componentWillReceiveProps(nextProps) {
    const { data: { me }, initialized } = nextProps;
    if (me && !initialized) this.initForm(me.currentTeam);
  }

  initForm = (team) => {
    const { projectName, projectDesc, prizePreference } = team;

    this.props.initialize({
      projectName,
      prizePreference,
      name: team.name,
      projectDesc: projectDesc || template,
    });

    this.setState({ descriptionRows: Math.max((projectDesc || template).split("\n").length, 10) });
  }

  //---------------------------------------------------------------------------
  // Callbacks
  //---------------------------------------------------------------------------
  updateTeam = (_) => {
    const { data: { me }, updateTeam } = this.props;

    const newValues = { ...this.props.formValues };
    newValues.prizePreference = JSON.stringify(newValues.prizePreference);
    console.log(newValues);

    return updateTeam({
      variables: { id: me.currentTeam.id, team: newValues },
    })
    .then(() => {
      this.setState({ editing: false });
      return null;
    })
    .catch(handleGraphQLErrors);
  }

  //---------------------------------------------------------------------------
  // Render
  //---------------------------------------------------------------------------
  render() {
    const { handleSubmit, formValues, data: { suffrages } } = this.props;
    const { descriptionRows } = this.state;

    return (
      <div className="Project editable">
        <div className="content white">
          <form onSubmit={handleSubmit(this.updateTeam)}>
            <label htmlFor="projectName">Name</label>
            <Field
              id="projectName"
              name="projectName"
              component="input"
              type="text"
              placeholder="Project name"
              className="fullwidth"
              autoComplete="off"
            />
            <ErrorMessage form="project" field="projectName" />

            <div className="markdown">
              <Field
                id="projectDesc"
                name="projectDesc"
                component="textarea"
                placeholder="Project description (markdown)"
                autoComplete="off"
                rows={descriptionRows}
                onChange={ev => {
                  const descriptionRows = ev.target.value.split("\n").length;
                  this.setState({ descriptionRows: Math.max(descriptionRows, 10) });
                }}
              />

              <ReactMarkdown source={formValues.projectDesc || ""} />

              <div className="prizes">
                <FieldArray
                  name="prizePreference"
                  component={({ fields }) =>
                    <SortablePrizes
                      fields={fields}
                      suffrageName={(id) => suffrages.find(s => s.id === id).name}
                      onSortEnd={({ oldIndex, newIndex }) => fields.move(oldIndex, newIndex)}
                      lockAxis="y"
                    />
                  }
                />
                <span className="notice">
                  re-order categories to show your preference!
                </span>
              </div>
            </div>

            <Button
              {...buttonPropsFromReduxForm(this.props)}
              type="submit"
              form
              primary
              centered
              feedbackSuccessLabel="Project updated!"
              feedbackFailureLabel="Error updating project"
              buttonRef={ref => this.submitButton = ref}
            >
              Update Project
            </Button>
          </form>
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("EditableProject"),

  setPropTypes({
    team: PropTypes.object,
  }),

  reduxForm({
    form: "project",
    validate,
    enableReinitialize: true,
  }),

  connect(state => ({
    formValues: getFormValues("project")(state) || {},
  })),

  graphql(gql`{
    me {
      ...fullUser
      favorites { id userId teamId }
      currentTeam { id projectName projectDesc prizePreference }
    }
    suffrages { id slug name }
  } ${fullUser}`),

  waitForData,

  graphql(
    gql`mutation createTeam($team: TeamInput!) {
      createTeam(team: $team) { ...fullTeam }
    } ${fullTeam}`,
    { name: "createTeam" },
  ),

  graphql(
    gql`mutation updateTeam($id: String!, $team: TeamInput!) {
      updateTeam(id: $id, team: $team) { ...fullTeam }
    } ${fullTeam}`,
    { name: "updateTeam" },
  ),

  graphql(
    gql`mutation deleteTeam($id: String!) {
      deleteTeam(id: $id) { id }
    }`,
    { name: "deleteTeam" },
  ),
)(EditableProject);

