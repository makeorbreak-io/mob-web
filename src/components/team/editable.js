import "./styles";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";
import { Field, reduxForm } from "redux-form";
import { isEmpty, isString, reduce } from "lodash";

//
// Components
import TeamMembers from "./members";
import { Button, ErrorMessage, SortableList } from "uikit";
import { Tabs, Tab, Panel } from "uikit/tabs";
import { Multiselect } from "components/fields";

//
// Redux
import { createTeam, updateTeam, deleteTeam } from "actions/teams";
import { refreshCurrentUser } from "actions/current_user";

//
// Constants
import technologies from "constants/technologies";

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

    const technologies = isString(values.technologies[0])
      ? values.technologies
      : values.technologies.map(t => t.value);

    return dispatch(updateTeam(team.id, { ...values, technologies }))
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

    const technologiesOptions = team && team.technologies
      ? [
          ...technologies,
          ...reduce(team.technologies, (all, t) => ([ ...all, { label: t, value: t }]), []),
        ]
      : technologies;

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

              {team &&
                <div>
                  <label htmlFor="project_name">Project name</label>
                  <Field id="project_name" name="project_name" component="input" type="text" placeholder="Project name" className="fullwidth" autoComplete="off" />
                  <ErrorMessage form="team" field="project_name" />

                  <label htmlFor="project_desc">Project description</label>
                  <Field id="project_desc" name="project_desc" component="textarea" placeholder="Project description" className="fullwidth" autoComplete="off" />
                  <ErrorMessage form="team" field="project_desc" />

                  <Field name="technologies" component={Multiselect} creatable options={technologiesOptions} placeholder="Technologies..." />
                  <ErrorMessage form="team" field="technologies" />
                </div>
              }

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

