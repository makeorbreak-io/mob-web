import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";
import { Field, reduxForm } from "redux-form";
import classnames from "classnames";
import { get } from "lodash";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

//
// Enhancers
import { withCurrentUser, waitForData } from "enhancers";

import { fullTeam } from "fragments";

import { handleGraphQLErrors } from "lib/graphql";

//
// Components
import TeamMembers from "components/TeamMembers";
import {
  Button,
  buttonPropsFromReduxForm,
  ErrorMessage,
} from "components/uikit";
import Invite from "components/Invite";

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
    const { team, initialized } = this.props;

    if (team && !initialized) this.initForm(team);
  }

  componentWillReceiveProps(nextProps) {
    const { team, initialized } = nextProps;

    if (team && !initialized) this.initForm(team);
  }

  initForm = (team) => {
    this.props.initialize({
      name: team.name,
    });
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
    const { createTeam, data } = this.props;

    return createTeam({
      variables: { team: values },
    })
    .then(() => {
      data.refetch();
      this.setState({ editing: false });
      return null;
    })
    .catch(handleGraphQLErrors);
  }

  updateTeam = (values) => {
    const { team, updateTeam } = this.props;

    return updateTeam({
      variables: { id: team.id, team: values },
    })
    .then(() => {
      this.setState({ editing: false });
      return null;
    })
    .catch(handleGraphQLErrors);
  }

  deleteTeam = () => {
    const { team, deleteTeam, data, change, untouch } = this.props;

    change("name", "");
    untouch("name");

    return deleteTeam({
      variables: { id: team.id },
    })
    .then(() => {
      data.refetch();
      this.setState({ editing: false });
      return null;
    })
    .catch(handleGraphQLErrors);
  }

  //---------------------------------------------------------------------------
  // Render
  //---------------------------------------------------------------------------
  render() {
    const { data: { me }, team, handleSubmit } = this.props;
    const { editing } = this.state;

    const teamId = get(me, "teams[0].id", null);

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
            {me.invitations.length > 0 && ", but you've been invited to some"}
            !
          </p>

          {me.invitations.map(i =>
            <Invite key={i.id} invite={i} disabled={!!teamId} />
          )}
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

  withCurrentUser,
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
)(EditableTeam);

