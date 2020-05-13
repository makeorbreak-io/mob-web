import React, { Component, Fragment } from "react";
import { compose, setDisplayName } from "recompose";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { every } from "lodash";
import { parse, distanceInWords } from "date-fns";
import cx from "classnames";

//
// gql
import { edition, suffrage } from "fragments";
import { waitForData } from "enhancers";

//
// components
import { DataTable, Btn, CollapsibleContainer } from "components/uikit";
import ResourceCreator from "components/admin/ResourceCreator";

//
// validation
import { composeValidators, validatePresence } from "validators";

const validate = composeValidators(
  validatePresence("name", "Category name"),
  validatePresence("slug", "Slug"),
);

const suffrageFields = [
  { component: "input", type: "text", name: "name", placeholder: "Name" },
  { component: "input", type: "text", name: "slug", placeholder: "Slug" },
];

const formatDate = date => date && [distanceInWords(parse(`${date}Z`), Date()), "ago"].join(" ");

export class AdminSuffrages extends Component {
  create = (suffrage, edition) => {
    const { createSuffrage, data } = this.props;

    return createSuffrage({ variables: {
      suffrage,
      editionId: edition.id,
    }})
    .then(() => data.refetch());
  }

  update = ({ id }, suffrage) => {
    const { updateSuffrage, data } = this.props;

    return updateSuffrage({ variables: { id, suffrage } })
    .then(() => data.refresh);
  }

  delete = ({ id }) => {
    const { deleteSuffrage, data } = this.props;

    return deleteSuffrage({ variables: { id } })
    .then(() => data.refetch());
  }

  start = ({ id }) => {
    return this.props.startSuffrageVoting({ variables: { id } });
  }

  end = ({ id }) => {
    return this.props.endSuffrageVoting({ variables: { id } });
  }

  resolve = ({ id }) => {
    return this.props.resolveSuffrage({ variables: { id } });
  }

  suffragesActions = (selected) => {
    return (
      <Fragment>
        {every(selected, s => !s.votingStartedAt && !s.votingEndedAt) && (
          <Btn
            className="icon icon--small icon--play"
            confirmation={`Really open votes for ${selected.map(s => s.name).join(", ")}?`}
            onClick={() => selected.forEach(this.start)}
          >
            Open Voting
          </Btn>
        )}

        {every(selected, s => s.votingStartedAt && !s.votingEndedAt) && (
          <Btn
            className="icon icon--small icon--stop"
            confirmation={`Really close votes for ${selected.map(s => s.name).join(", ")}?`}
            onClick={() => selected.forEach(this.end)}
          >
            Close Voting
          </Btn>
        )}

        {every(selected, s => s.votingStartedAt && s.votingEndedAt) && (
          <Btn
            className="icon icon--small icon--how-to-vote"
            confirmation={`Really calculate podiums for ${selected.map(s => s.name).join(", ")}?`}
            onClick={() => selected.forEach(this.resolve)}
          >
            Resolve Votes
          </Btn>
        )}

        <Btn
          className="icon icon--small icon--delete"
          confirmation={`Really delete ${selected.map(s => s.name).join(", ")}?`}
          onClick={() => selected.forEach(this.delete)}
        >
          Delete {selected.length} suffrages
        </Btn>
      </Fragment>
    );
  }

  render() {
    const { editions } = this.props.data;
    const defaultEdition = editions.find(c => c.isDefault);
    const empty = true;

    return (
      <div className="admin--container admin--suffrages">
        <ul>
          {[ defaultEdition, ...editions.filter(c => !c.isDefault)].map(edition => (
            <li
              key={edition.id}
              className={cx({ "edition--default": edition.isDefault })}
            >
              <CollapsibleContainer
                preview={<h3>{edition.isDefault && <span className="icon icon--star" />} {edition.name}</h3>}
                defaultExpanded={edition.isDefault}
              >
                <DataTable
                  source={edition.suffrages}
                  labels={[ "Name" , "slug" , "Voting Started"  , "Voting Ended"  , "Podium" ]}
                  sorter={[ "name" , "slug" , "votingStartedAt" , "votingEndedAt" , "podium" ]}
                  search={[ "name" , "slug" , "votingStartedAt" , "votingEndedAt" , "podium" ]}
                  editable
                  fixed
                  sourceFields={[ ...suffrageFields, { empty }, { empty }, { empty } ]}
                  validate={validate}
                  onUpdateSubmit={this.update}
                  actions={this.suffragesActions}
                  render={(edition, select, edit) => (
                    <tr key={edition.id}>
                      {select}
                      <td>{edition.name}</td>
                      <td>{edition.slug}</td>
                      <td>{formatDate(edition.votingStartedAt)}</td>
                      <td>{formatDate(edition.votingEndedAt)}</td>
                      <td>{edition.podium && edition.podium.toString()}</td>
                      {edit}
                    </tr>
                  )}
                />

                <ResourceCreator
                  form={`newSuffrage-${edition.id}`}
                  fields={suffrageFields}
                  onSubmit={suffrage => this.create(suffrage, edition)}
                  validate={validate}
                  label="Create Category"
                />
              </CollapsibleContainer>
            </li>
          ))}
          </ul>
      </div>
    );
  }
}

export default compose(
  setDisplayName("AdminSuffrages"),

  graphql(
    gql`{
      editions {
        ...edition
        suffrages { ...suffrage }
      }
    } ${suffrage} ${edition}`
  ),

  waitForData,

  graphql(
    gql`mutation createSuffrage($suffrage: SuffrageInput!, $editionId: String!) {
      createSuffrage(suffrage: $suffrage, editionId: $editionId) { ...suffrage }
    } ${suffrage}`,
    { name: "createSuffrage" }
  ),

  graphql(
    gql`mutation updateSuffrage($id: String!, $suffrage: SuffrageInput!) {
      updateSuffrage(id: $id, suffrage: $suffrage) { ...suffrage }
    } ${suffrage}`,
    { name: "updateSuffrage" }
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
    gql`mutation resolveSuffrage($id: String!) {
      resolveSuffrage(id: $id) { ...suffrage }
    } ${suffrage}`,
    { name: "resolveSuffrage" }
  ),

  graphql(
    gql`mutation deleteSuffrage($id: String!) {
      deleteSuffrage(id: $id) { ...suffrage }
    } ${suffrage}`,
    { name: "deleteSuffrage" }
  ),
)(AdminSuffrages);

