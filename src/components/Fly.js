import "styles/fly";
import "styles/fly.responsive";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { graphql } from "react-apollo";
import { reduxForm, Field } from "redux-form";
import gql from "graphql-tag";

//
// Components
import { Button, DataTable, ErrorMessage } from "components/uikit";

//
// Enhancers
import { waitForData } from "enhancers";

//
// Assets
import logo from "assets/images/mob-logo-white.svg";

//
// Constants
import { ADMIN } from "constants/roles";

//
// Validators
import { composeValidators, validatePresence, validateEmail } from "validators";

import { toInt } from "lib/redux-form";

const validate = composeValidators(
  validatePresence("name", "Name"),
  validateEmail("email", "Email"),
  validatePresence("time", "Time (miliseconds)"),
);

export class Fly extends Component {

  addEntry = (flyby) => {
    const { createFlyby, data, reset } = this.props;

    return createFlyby({ variables: { flyby } })
    .then(() => {
      reset();
      data.refetch();
      return null;
    });
  }

  deleteEntry = (id) => () => {
    const { deleteFlyby, data } = this.props;

    return deleteFlyby({ variables: { id } })
    .then(() => data.refetch());
  }

  render() {
    const { data: { me, flybys }, handleSubmit } = this.props;

    const isAdmin = me && me.role === ADMIN;

    const leaderboard = [ ...flybys ].sort((a,b) => b.time - a.time);

    return (
      <div className="Fly">
        <div className="Fly-banner">
          <div className="content">
            <h2><img src={logo} width="200" /></h2>
            <h2>@ ENEI 2018</h2>
            <h1>FL<span>Y</span></h1>
            <h3>The sky is the limit.<br />Compete and win!</h3>
          </div>
        </div>

        <div className="content">
          <div className="Fly-rules">
            <div>
              <div className="prize" />
            </div>

            <div>
              <h1>Paper plane competition</h1>
              <h2>Compete and win an<span>Ultimate Ears BOOM 2</span></h2>

              <p>Enjoy our paper airplane competition @ ENEI 2018, March 24-26</p>
              <p>Build your plane using one of our flyers, and keep it in the air for the longest amount of time possible.</p>
              <p>Find our booth, enter your name in the leaderboard, and may the best thrower win!<br />PLEASE DO NOT LITTER.</p>

              <a href="https://github.com/makeorbreak-io/enei-2018-fly" target="_blank" rel="noopener noreferrer">
                <Button outline cyan large>Regulation</Button>
              </a>
            </div>
          </div>

          <div className="Fly-leaderboard">
            <h1>Leaderboard</h1>

            {isAdmin &&
              <form onSubmit={handleSubmit(this.addEntry)}>
                <div className="fields">
                  <Field component="input" name="name" placeholder="Name" type="text" />
                  <Field component="input" name="email" placeholder="Email" type="text" />
                  <Field component="input" name="time" placeholder="Time (in miliseconds)" type="number" parse={toInt} />
                  <Button primary type="submit">Add entry</Button>
                </div>

                <ErrorMessage form="new-flyby" field="name" />
                <ErrorMessage form="new-flyby" field="email" />
                <ErrorMessage form="new-flyby" field="time" />
              </form>
            }

            <DataTable
              source={leaderboard}
              search={isAdmin ? [ "name" , "email" ] : [ "name" ]}
              labels={isAdmin ? [ "Name" , "Email" , "Time"  , "Delete" ] : [ "Name" , "Time" ]}
              headcx={isAdmin ? [ null   , null    , "right" , null ]     : [ null   , "right" ]}
              render={flyby => (
                <tr key={flyby.id}>
                  <td>{flyby.name}</td>
                  {isAdmin && <td>{flyby.email}</td>}
                  <td className="right">{flyby.time}</td>
                  {isAdmin && <td><Button small otline danger onClick={this.deleteEntry(flyby.id)} confirmation={`Really delete ${flyby.name} (${flyby.time} ms)?`}>Delete</Button></td>}
                </tr>
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  setDisplayName("Fly"),

  reduxForm({
    form: "new-flyby",
    validate,
  }),

  graphql(gql`{
    me { id, role }
    flybys { id, name, email, time }
  }`),

  waitForData,

  graphql(
    gql`mutation createFlyby($flyby: FlybyInput!) {
      createFlyby(flyby: $flyby) { id, name, email, time }
    }`,
    { name: "createFlyby" },
  ),

  graphql(
    gql` mutation deleteFlyby($id: String!) {
      deleteFlyby(id: $id) { id }
    }`,
    { name: "deleteFlyby" },
  ),
)(Fly);
