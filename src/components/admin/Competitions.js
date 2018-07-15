import React, { Component, Fragment } from "react";
import { compose } from "recompose";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { competition } from "fragments";
import { waitForData } from "enhancers";

import { DataTable, Btn } from "components/uikit";
import ResourceCreator from "components/admin/ResourceCreator";

import { validatePresence, composeValidators } from "validators";

const validate = composeValidators(
  validatePresence("name", "Name"),
  validatePresence("status", "Status"),
);

const competitionFields = [
  { component: "input", type: "text", name: "name", placeholder: "Name" },
  {
    component: "select", name: "status", placeholder: "Status", options: [
      { value: "created" , label: "Created" },
      { value: "started" , label: "Started" },
      { value: "ended"   , label: "Ended" },
    ],
  },
];

export class AdminCompetitions extends Component {
  createCompetition = (competition) => {
    const { createCompetition, data } = this.props;

    return createCompetition({ variables: { competition } })
    .then(() => data.refetch());
  }

  updateCompetition = ({ id }, competition) => {
    return this.props.updateCompetition({ variables: { id, competition }});
  }

  setCompetitionAsDefault = ({ id }) => {
    const { setCompetitionAsDefault, data } = this.props;

    return setCompetitionAsDefault({ variables: { id }})
    .then(() => data.refetch());
  }

  deleteCompetition = ({ id }) => {
    const { deleteCompetition, data } = this.props;

    return deleteCompetition({ variables: { id } })
    .then(() => data.refetch());
  }

  renderActions = (selected) => (
    <Fragment>
      {selected.length === 1 &&
        <Btn
          className="icon icon--small icon--star"
          confirmation={`Really make "${selected[0].name}" the default competition?`}
          onClick={() => this.setCompetitionAsDefault(selected[0])}
        >
          Set as default competition
        </Btn>
      }

      <Btn
        className="icon icon--small icon--delete"
        confirmation={`Really delete ${selected.length} users?`}
        onClick={() => selected.forEach(this.deleteCompetition)}
      >
        Delete {selected.length} competitions
      </Btn>
    </Fragment>
  );

  render() {
    const { competitions } = this.props.data;
    const empty = true;

    return (
      <div className="admin--container admin--competitions">
        <DataTable
          source={competitions}
          labels={[ "Default" , "Name" , "Status" ]}
          sorter={[ "default" , "name" , "status" ]}
          search={[ "default" , "name" , "status" ]}
          actions={this.renderActions}
          editable
          sourceFields={[{ empty }, ...competitionFields]}
          onUpdateSubmit={this.updateCompetition}
          fixed
          render={(competition, select, edit) => (
            <tr key={competition.id} className={competition.status}>
              {select}
              <td className="mobile">{competition.isDefault.toString()}</td>
              <td className="mobile">{competition.name}</td>
              <td className="mobile">{competition.status}</td>
              {edit}
            </tr>
          )}
        />

        <ResourceCreator
          form="newCompetition"
          fields={competitionFields}
          onSubmit={this.createCompetition}
          validate={validate}
        />
      </div>
    );
  }
}

export default compose(
  graphql(gql`{ competitions { ...competition } } ${competition}`),

  waitForData,

  graphql(
    gql`mutation createCompetition($competition: CompetitionInput!) {
      createCompetition(competition: $competition) { ...competition }
    } ${competition}`,
    { name: "createCompetition" },
  ),

  graphql(
    gql`mutation updateCompetition($id: String!, $competition: CompetitionInput!) {
      updateCompetition(id: $id, competition: $competition) { ...competition }
    } ${competition}`,
    { name: "updateCompetition" },
  ),

  graphql(
    gql`mutation setCompetitionAsDefault($id: String!) {
      setCompetitionAsDefault(id: $id) { ...competition }
    } ${competition}`,
    { name: "setCompetitionAsDefault" },
  ),

  graphql(
    gql`mutation deleteCompetition($id: String!) {
      deleteCompetition(id: $id)
    }`,
    { name: "deleteCompetition" },
  ),
)(AdminCompetitions);
