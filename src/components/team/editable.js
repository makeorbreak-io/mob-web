import "./styles";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";
import { Field, reduxForm } from "redux-form";
import { get, isEmpty } from "lodash";

//
// Components
import TeamMembers from "./members";
import Project from "components/project";
import { Button, ErrorMessage, SortableList } from "uikit";
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

const PRIZES = {
  "hardcore": "Hardcore (Oculus Rift)",
  "funny": "Funny (Nintendo Switch)",
  "useful": "Useful (Dell U2715H)",
};

const PLACES = [ "1st", "2nd", "3rd" ];

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

  handlePrizeOrderChange = (items) => {
    const { dispatch, team } = this.props;

    return dispatch(updateTeam(team.id, { prize_preference: items }))
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

    const prizePreferences = team && !isEmpty(team.prize_preference)
    ? team.prize_preference
    : [ "hardcore", "funny", "useful" ];

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

            {team &&
              <div>
                <hr />
                <TeamMembers team={team} editable />

                {team && team.applied &&
                  <div className="prize-order-preferences">
                    <hr />
                    <label>Prize order preferences</label>
                    <p>
                      Set the preference order for your prizes, from most preferred (top) to less preferred (bottom).
                      In case your project wins multiple categories, this will be used to break ties and decide on what your prize will be.
                    </p>

                    <SortableList
                      items={prizePreferences}
                      render={(category, index) => (
                        <li className={category}>
                          {PLACES[index]}: {PRIZES[category]}
                        </li>
                      )}
                      onUpdate={this.handlePrizeOrderChange}
                    />
                  </div>
                }

                <hr/ >
                <Project
                  id={get(team, "project.id", null)}
                  team={team}
                  editable
                />

                <hr />
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

