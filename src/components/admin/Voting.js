import React, { Component, Fragment } from "react";
import { compose, setDisplayName } from "recompose";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { every } from "lodash";
import { parse, distanceInWords } from "date-fns";
import cx from "classnames";

//
// gql
import { competition, suffrage } from "fragments";
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
  create = (suffrage, competition) => {
    const { createSuffrage, data } = this.props;

    return createSuffrage({ variables: {
      suffrage,
      competitionId: competition.id,
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
    const { competitions } = this.props.data;
    const defaultCompetition = competitions.find(c => c.isDefault);
    const empty = true;



    return (
      <div className="admin--container admin--suffrages">
        <ul>
          {[ defaultCompetition, ...competitions.filter(c => !c.isDefault)].map(competition => (
            <li
              key={competition.id}
              className={cx({ "competition--default": competition.isDefault })}
            >
              <CollapsibleContainer
                preview={<h3>{competition.isDefault && <span className="icon icon--star" />} {competition.name}</h3>}
                defaultExpanded={competition.isDefault}
              >
                <DataTable
                  source={competition.suffrages}
                  labels={[ "Name" , "slug" , "Voting Started"  , "Voting Ended"  , "Podium" ]}
                  sorter={[ "name" , "slug" , "votingStartedAt" , "votingEndedAt" , "podium" ]}
                  search={[ "name" , "slug" , "votingStartedAt" , "votingEndedAt" , "podium" ]}
                  editable
                  fixed
                  sourceFields={[ ...suffrageFields, { empty }, { empty }, { empty } ]}
                  validate={validate}
                  onUpdateSubmit={this.update}
                  actions={this.suffragesActions}
                  render={(competition, select, edit) => (
                    <tr key={competition.id}>
                      {select}
                      <td>{competition.name}</td>
                      <td>{competition.slug}</td>
                      <td>{formatDate(competition.votingStartedAt)}</td>
                      <td>{formatDate(competition.votingEndedAt)}</td>
                      <td>{competition.podium}</td>
                      {edit}
                    </tr>
                  )}
                />

                <ResourceCreator
                  form={`newSuffrage-${competition.id}`}
                  fields={suffrageFields}
                  onSubmit={suffrage => this.create(suffrage, competition)}
                  validate={validate}
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
      competitions {
        ...competition
        suffrages { ...suffrage }
      }
    } ${suffrage} ${competition}`
  ),

  waitForData,

  graphql(
    gql`mutation createSuffrage($suffrage: SuffrageInput!, $competitionId: String!) {
      createSuffrage(suffrage: $suffrage, competitionId: $competitionId) { ...suffrage }
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
    gql`mutation deleteSuffrage($id: String!) {
      deleteSuffrage(id: $id) { ...suffrage }
    } ${suffrage}`,
    { name: "deleteSuffrage" }
  ),
)(AdminSuffrages);

