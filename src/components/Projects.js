import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import classnames from "classnames";
import { Link } from "react-router";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

//
// gql
import { fullUser } from "fragments";
import { waitForData } from "enhancers";

export class Projects extends Component {

  toggleFavorite = (teamId) => () => {
    const { data, toggleProjectFavorite } = this.props;

    if (!data.me) return;

    return toggleProjectFavorite({ variables: { teamId } })
    .then(() => data.refetch());
  }

  render() {

    const { data: { me, projects, suffrages } } = this.props;
    const myFavorites = (me && me.favorites.map(f => f.teamId)) || [];

    return (
      <div className="Projects">
        <div className="content white">
          <ul className="projects">
            {projects.map(team => {
              const category = suffrages.find(s => s.id === team.prizePreference[0]).name;
              return (
                <li key={team.id} className="project">
                  <div
                    className={classnames("favorite", { "is-favorite": myFavorites.includes(team.id) })}
                    onClick={this.toggleFavorite(team.id)}
                  />
                  <div className="title">
                    <span><Link to={`project/${team.id}`}>{team.projectName}</Link> <span className={`tag ${category}`}>{category}</span></span>
                    <span>by {team.name}</span>
                  </div>
                </li>
              );
            })}
          </ul>
          <aside className="projects-notes">
            <p>This is the list of projects done in 2018 Make or Break hackathon</p>
            <p>Get to know the projects that interest you the most, and make sure to check them out at the fair!</p>
            <p>Project categroy in list is simply the team's preferrence, and is not binding.</p>
            <p>Every project is a potential winner on every category, but can only win in of the categories (to make sure 3 teams are awarded prizes).</p>
            <p>Clicking on <img /> allows you to mark a project as a favorite, but does not count as a vote. <Link to="/voting-booth">Vote here</Link> when the fair ends.</p>
          </aside>
        </div>
      </div>
    );
  }
}

export default compose(
  setDisplayName("Projects"),

  graphql(gql`{
    me { ...fullUser }
    projects { # actually teams
      id
      name
      projectName
      projectDesc
      prizePreference
      favorites { id }
    }
    suffrages { id name }
  } ${fullUser}`),

  waitForData,

  graphql(
    gql`mutation toggleProjectFavorite($teamId: String!) {
      toggleProjectFavorite(teamId: $teamId) { id }
    }`,
    { name: "toggleProjectFavorite" },
  ),
)(Projects);
