import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import ReactMarkdown from "react-markdown";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import classnames from "classnames";
import { Link } from "react-router";

//
// gql
import { fullUser } from "fragments";
import { waitForData } from "enhancers";

import { Avatar } from "components/uikit";

export class StaticProject extends Component {

  toggleFavorite = (teamId) => () => {
    const { data, toggleProjectFavorite } = this.props;

    if (!data.me) return;

    return toggleProjectFavorite({ variables: { teamId } })
    .then(() => data.refetch());
  }

  render() {
    const { data: { team, me, suffrages } } = this.props;
    const myFavorites = (me && me.favorites.map(f => f.teamId)) || [];

    return (
      <div className="Project static">
        <div className="content white">
          <Link className="navigation" to="/projects">← Back to Projects</Link>

          <div className="project">
            <h1 className="project-name">
              {me &&
                <div
                  className={classnames("favorite", { "is-favorite": myFavorites.includes(team.id) })}
                  onClick={this.toggleFavorite(team.id)}
                />
              }
              {team.projectName}
            </h1>

            <ReactMarkdown source={team.projectDesc} className="project-desc" />
          </div>

          <div className="team-details">
            <h3>Prize Preferences</h3>
            <span className="notice"></span>
            <ul className="prize-preference">
              {team.prizePreference.map(id => {
                const category = suffrages.find(s => s.id === id).name;
                return (
                  <li key={category} className={`prize ${category}`}>{category}</li>
                );
              })}
            </ul>

            <h3>Team members</h3>
            <ul className="members">
              {team.memberships.map(m => (
                <li key={m.user.id}><Avatar user={m.user} />{m.user.displayName}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  setDisplayName("StaticProject"),

  graphql(
    gql`
    query team($id: String!) {
      me { ...fullUser }

      team(id: $id) {
        id
        name
        memberships { user { id displayName gravatarHash } }
        favorites { id }
        projectName
        projectDesc
        prizePreference
      }

      suffrages { id name }
    } ${fullUser}`,
    {
      skip: props => !props.id,
      options: props => ({
        variables: { id: props.id },
      }),
    },
  ),

  waitForData,

  graphql(
    gql`mutation toggleProjectFavorite($teamId: String!) {
      toggleProjectFavorite(teamId: $teamId) { id }
    }`,
    { name: "toggleProjectFavorite" },
  ),
)(StaticProject);
