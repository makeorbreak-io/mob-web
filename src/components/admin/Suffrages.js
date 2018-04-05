import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { reduxForm, Field } from "redux-form";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

//
// gql
import { suffrage } from "fragments";
import { waitForData } from "enhancers";

//
// components
import { Button, ErrorMessage } from "components/uikit";

//
// validation
import { composeValidators, validatePresence } from "validators";

const validate = composeValidators(
  validatePresence("name", "Category name"),
  validatePresence("slug", "Slug"),
);

export class AdminSuffrages extends Component {
  create = (suffrage) => {
    const { createSuffrage, data, reset } = this.props;

    return createSuffrage({ variables: { suffrage } })
    .then(() => reset())
    .then(() => data.refetch());
  }

  delete = (id) => {
    const { deleteSuffrage, data } = this.props;

    return deleteSuffrage({ variables: { id } })
    .then(() => data.refetch());
  }

  start = (id) => {
    return this.props.startSuffrageVoting({ variables: { id } });
  }

  stop = (id) => {
    return this.props.endSuffrageVoting({ variables: { id } });
  }

  render() {
    const { data: { suffrages }, handleSubmit } = this.props;

    return (
      <div className="AdminSuffrages">
        <form onSubmit={handleSubmit(this.create)}>
          <Field name="name" component="input" type="text" placeholder="Category name" />
          <Field name="slug" component="input" type="text" placeholder="Slug" />

          <Button primary type="submit">Create category</Button>

          <ul>
            <li><ErrorMessage form="suffrage" field="name" /></li>
            <li><ErrorMessage form="suffrage" field="slug" /></li>
          </ul>
        </form>

        <ul>
          {suffrages.map(suffrage => {
            const isStarted = suffrage.votingStartedAt !== null;
            const isStopped = isStarted && suffrage.votingEndedAt !== null;

            return (
              <li key={suffrage.id}>
                <span className="slug">{suffrage.slug}</span>
                <span>{suffrage.name}</span>
                <span><Button disabled={isStarted || isStopped}  primary small onClick={() => this.start(suffrage.id)}>Start voting</Button></span>
                <span><Button disabled={!isStarted || !isStopped} primary small onClick={() => this.end(suffrage.id)}>End voting</Button></span>
                <span><Button danger small onClick={() => this.delete(suffrage.id)}>Delete</Button></span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default compose(
  setDisplayName("AdminSuffrages"),

  graphql(gql`{ suffrages { ...suffrage } } ${suffrage}`),
  waitForData,

  graphql(
    gql`mutation createSuffrage($suffrage: SuffrageInput!) {
      createSuffrage(suffrage: $suffrage) { ...suffrage }
    } ${suffrage}`,
    { name: "createSuffrage" }
  ),

  graphql(
    gql`mutation startSuffrageVoting($id: String!) {
      startSuffrageVoting(id: $id) { ...suffrage }
    } ${suffrage}`,
    { name: "startSuffrageVoting" }
  ),

  graphql(
    gql`mutation endSuffrageVoting($id: String!) {
      endSuffrageVoting(id: $id) { ...suffrage }
    } ${suffrage}`,
    { name: "endSuffrageVoting" }
  ),

  graphql(
    gql`mutation deleteSuffrage($id: String!) {
      deleteSuffrage(id: $id) { ...suffrage }
    } ${suffrage}`,
    { name: "deleteSuffrage" }
  ),

  reduxForm({
    form: "suffrage",
    validate,
  })
)(AdminSuffrages);
