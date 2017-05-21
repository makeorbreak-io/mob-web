import "./styles";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";
import { get } from "lodash";
import { Field, reduxForm } from "redux-form";

//
// Components
import {
  Button,
  ErrorMessage,
} from "uikit";

//
// Redux
import { createTeam, updateTeam, fetchTeam } from "actions/team";

//
// Validation
import { composeValidators, validatePresence } from "validators";

const validate = (values) => {
  return composeValidators(
    validatePresence("team_name", "Team name"),
  )(values);
};

export class Team extends Component {

  //---------------------------------------------------------------------------
  // Lifecycle
  //---------------------------------------------------------------------------
  componentWillMount() {
    this.requestTeam(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const previousTeam = this.props.currentUser.team || {};
    const team = nextProps.currentUser.team || {};

    if (previousTeam.id !== team.id) {
      this.requestTeam(nextProps);
    }
  }

  //---------------------------------------------------------------------------
  // Helpers
  //---------------------------------------------------------------------------
  requestTeam = (props) => {
    const { currentUser, dispatch, initialize } = props;
    const id = get(currentUser, "team.id", null);

    if (id) {
      return dispatch(fetchTeam(id))
      .then(team => initialize(team, false));
    }
  }

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
    const { handleSubmit, team, submitting } = this.props;

    const submitHandler = team ? this.updateTeam : this.createTeam;

    return (
      <div className="Team">
        <form onSubmit={handleSubmit(submitHandler)}>

        <Field name="team_name" component="input" type="text" placeholder="Team name" className="fullwidth" autoComplete="off" />
        <ErrorMessage form="team" field="team_name" />

        <Button type="submit" form primary disabled={submitting} loading={submitting}>
          {team ? "Update team" : "Create team" }
        </Button>
        </form>
      </div>
    );
  }

}

export default compose(
  setDisplayName("Team"),

  connect(({ currentUser, team }) => ({ currentUser, team })),

  reduxForm({
    form: "team",
    validate,
  })
)(Team);
