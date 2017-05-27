import "./styles";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";
import { Field, reduxForm } from "redux-form";
import { get } from "lodash";

//
// Components
import TeamMembers from "./editable.members";
import Project from "components/project";
import {
  Button,
  ErrorMessage,
  FormSectionHeader,
} from "uikit";

//
// Redux
import { createTeam, updateTeam } from "actions/teams";

//
// Validation
import { composeValidators, validatePresence } from "validators";

const validate = (values) => {
  return composeValidators(
    validatePresence("name", "Team name"),
  )(values);
};

export class EditableTeam extends Component {

  //---------------------------------------------------------------------------
  // Lifecycle
  //---------------------------------------------------------------------------
  componentWillMount() {
    const { initialize, team } = this.props;

    initialize(team);
  }

  componentWillReceiveProps(nextProps) {
    const { initialize, team } = nextProps;

    if (!this.props.team && nextProps.team) initialize(team);
  }

  //---------------------------------------------------------------------------
  // Callbacks
  //---------------------------------------------------------------------------
  createTeam = (values) => {
    return this.props.dispatch(createTeam(values));
  }

  updateTeam = (values) => {
    const { dispatch, team } = this.props;

    return dispatch(updateTeam(team.id, values));
  }

  //---------------------------------------------------------------------------
  // Render
  //---------------------------------------------------------------------------
  render() {
    const { team, handleSubmit, submitting } = this.props;
    const id = get(team, "project.id", null);

    const submitHandler = team ? this.updateTeam : this.createTeam;

    return (
      <div className="Team editable">

        <FormSectionHeader>Team</FormSectionHeader>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Field name="name" component="input" type="text" placeholder="Team name" className="fullwidth" autoComplete="off" />
          <ErrorMessage form="team" field="name" />

          <Button type="submit" form primary disabled={submitting} loading={submitting}>
            {team ? "Update team" : "Create team" }
          </Button>
        </form>

        {team &&
          <div>
            <FormSectionHeader>Members</FormSectionHeader>
            <TeamMembers team={team} />
          </div>
        }

        {team &&
          <div>
            <FormSectionHeader>Project</FormSectionHeader>
            <Project {...{ id, team }} editable />
          </div>
        }
      </div>
    );
  }

}

export default compose(
  setDisplayName("EditableTeam"),

  setPropTypes({
    team: PropTypes.object,
  }),

  reduxForm({
    form: "team",
    validate,
  }),
)(EditableTeam);

