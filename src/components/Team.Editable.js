import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";
import { Field, reduxForm } from "redux-form";
import classnames from "classnames";
import { map, get } from "lodash";
import { connect } from "react-redux";

//
// Components
import TeamMembers from "./TeamMembers";
import {
  Button,
  buttonPropsFromReduxForm,
  ErrorMessage,
} from "components/uikit";
import Invitation from "components/Invitation";

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

  state = {
    editing: false,
  }

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
  handleToggle = () => {
    const { editing } = this.state;

    if (editing) {
      this.submitButton.click();
    }
    else {
      this.setState({ editing: true });
    }

  }

  createTeam = (values) => {
    const { dispatch } = this.props;

    return dispatch(createTeam(values))
    .finally(() => {
      this.setState({ editing: false });
      dispatch(refreshCurrentUser());
    });
  }

  updateTeam = (values) => {
    const { dispatch, team } = this.props;

    return dispatch(updateTeam(team.id, values))
    .finally(() => {
      dispatch(refreshCurrentUser());
      this.setState({ editing: false });
    });
  }

  deleteTeam = () => {
    const { dispatch, change, untouch, team } = this.props;

    dispatch(change("name", ""));
    dispatch(untouch("name"));

    return dispatch(deleteTeam(team.id))
    .finally(() => {
      dispatch(refreshCurrentUser());
      this.setState({ editing: false });
    });
  }

  //---------------------------------------------------------------------------
  // Render
  //---------------------------------------------------------------------------
  render() {
    const { currentUser, currentUser: { invitations }, team, handleSubmit } = this.props;
    const { editing } = this.state;

    const teamId = get(currentUser, "team.id", false);

    const submitHandler = team ? this.updateTeam : this.createTeam;
    const toggleLabel = classnames({
      "Create": !team,
      "Update": team && editing,
      "Edit": team && !editing,
    });
    const statusLabel = classnames({
      "not applied": team && !team.applied,
      "under review": team && team.applied,
      // "approved": team.approved, // TODO: wait until review process is implemented
    });

    const cx = classnames("Team editable", { editing });
    const teamDescriptionCx = classnames({ hidden: !team || editing });
    const noTeamWarningCx = classnames({ hidden: team || editing });

    return (
      <div className={cx}>
        <h2>
          <div className="title">
            <span>Hackathon team</span>
            {team && <span className="status">({statusLabel})</span>}
          </div>

          <div className="actions">
            {editing &&
              <Button
                small
                onClick={() => this.setState({ editing: false })}
              >
                Cancel
              </Button>
            }

            {editing && team &&
              <Button
                danger
                small
                confirmation="Are you sure you want to delete your team? All memberships and invites will be lost."
                onClick={this.deleteTeam}
              >
                Delete team
              </Button>
            }

            <Button
              {...buttonPropsFromReduxForm(this.props)}
              primary
              small
              feedbackSuccessLabel={team ? "Team updated!" : "Team created!" }
              feedbackFailureLabel={team ? "Error updating team" : "Error creating team" }
              onClick={this.handleToggle}
            >
              {toggleLabel}
            </Button>
          </div>
        </h2>

        <div className={teamDescriptionCx}>
          <label>Name</label>
          <p>{team && team.name}</p>
        </div>

        <div className={noTeamWarningCx}>
          <p>
            You are not part of a team yet
            {invitations.length > 0 && ", but you've been invited to some"}
            !
          </p>
          {map(invitations, i => <Invitation key={i.id} invitation={i} disabled={teamId} /> )}
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className={editing ? "": "hidden"}>
          <label htmlFor="name">Name</label>
          <Field id="name" name="name" component="input" type="text" placeholder="Team name" className="fullwidth" autoComplete="off" />
          <ErrorMessage form="team" field="name" />
          
          <Button
            {...buttonPropsFromReduxForm(this.props)}
            type="submit"
            form
            primary
            feedbackSuccessLabel={team ? "Team updated!" : "Team created!" }
            feedbackFailureLabel={team ? "Error updating team" : "Error creating team" }
            buttonRef={ref => this.submitButton = ref}
          >
            {team ? "Update team" : "Create team" }
          </Button>
        </form>

        {team && <TeamMembers team={team} editing={editing} editable />}
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

  connect(({ currentUser }) => ({ currentUser }))
)(EditableTeam);

