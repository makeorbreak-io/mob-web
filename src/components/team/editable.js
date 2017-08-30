import "./styles";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";
import { Field, reduxForm } from "redux-form";
import { get } from "lodash";

//
// Components
import TeamMembers from "./members";
import Project from "components/project";
import {
  Button,
  ErrorMessage,
} from "uikit";
import { Tabs, Tab, Panel } from "uikit/tabs";

//
// Redux
import { createTeam, updateTeam, deleteTeam } from "actions/teams";
import { refreshCurrentUser } from "actions/current_user";

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
    const { dispatch } = this.props;

    return dispatch(createTeam(values))
    .finally(() => dispatch(refreshCurrentUser()));
  }

  updateTeam = (values) => {
    const { dispatch, team } = this.props;

    return dispatch(updateTeam(team.id, values))
    .finally(() => dispatch(refreshCurrentUser()));
  }

  deleteTeam = () => {
    const { dispatch, change, untouch, team } = this.props;

    dispatch(change("name", ""));
    dispatch(untouch("name"));

    return dispatch(deleteTeam(team.id))
    .finally(() => dispatch(refreshCurrentUser()));
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
        <Tabs selected={0}>
          <Tab><span>Team Settings</span></Tab>

          <Panel>
            <form onSubmit={handleSubmit(submitHandler)}>
              <label htmlFor="name">Team name</label>
              <Field id="name" name="name" component="input" type="text" placeholder="Team name" className="fullwidth" autoComplete="off" />
              <ErrorMessage form="team" field="name" />

              <Button type="submit" form centered fullwidth primary disabled={submitting} loading={submitting}>
                {team ? "Update team" : "Create team" }
              </Button>
            </form>

            {team && <hr />}

            {team && <TeamMembers team={team} editable />}

            {team && <hr />}

            {team && <Project {...{ id, team }} project={team.project} editable />}

            {team &&
              <div className="danger-zone">
                <Button
                  form
                  fullwidth
                  centered
                  danger
                  confirmation="Are you sure you want to delete your team?"
                  onClick={this.deleteTeam}
                >
                  Delete "{team.name}" team
                </Button>

                <p>Delete this team, and all of its memberships, invites, and projects.</p>
              </div>
            }
          </Panel>
        </Tabs>
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

