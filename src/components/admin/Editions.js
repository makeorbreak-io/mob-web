import React, { Component, Fragment } from "react";
import { compose } from "recompose";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import cx from "classnames";

import { edition } from "fragments";
import { waitForData } from "enhancers";

import { DataTable, Btn } from "components/uikit";
import ResourceCreator from "components/admin/ResourceCreator";

import { validatePresence, composeValidators } from "validators";

const validate = composeValidators(
  validatePresence("name", "Name"),
  validatePresence("status", "Status"),
);

const editionFields = [
  { component: "input", type: "text", name: "name", placeholder: "Name" },
  {
    component: "select", name: "status", placeholder: "Status", options: [
      { value: "created" , label: "Created" },
      { value: "started" , label: "Started" },
      { value: "ended"   , label: "Ended" },
    ],
  },
];

export class AdminEditions extends Component {
  createEdition = (edition) => {
    const { createEdition, data } = this.props;

    return createEdition({ variables: { edition } })
    .then(() => data.refetch());
  }

  updateEdition = ({ id }, edition) => {
    return this.props.updateEdition({ variables: { id, edition }});
  }

  setEditionAsDefault = ({ id }) => {
    const { setEditionAsDefault, data } = this.props;

    return setEditionAsDefault({ variables: { id }})
    .then(() => data.refetch());
  }

  deleteEdition = ({ id }) => {
    const { deleteEdition, data } = this.props;

    return deleteEdition({ variables: { id } })
    .then(() => data.refetch());
  }

  renderActions = (selected) => (
    <Fragment>
      {selected.length === 1 &&
        <Btn
          className="icon icon--small icon--star"
          confirmation={`Really make "${selected[0].name}" the default edition?`}
          onClick={() => this.setEditionAsDefault(selected[0])}
        >
          Set as default edition
        </Btn>
      }

      <Btn
        className="icon icon--small icon--delete"
        confirmation={`Really delete ${selected.length} users?`}
        onClick={() => selected.forEach(this.deleteEdition)}
      >
        Delete {selected.length} editions
      </Btn>
    </Fragment>
  );

  render() {
    const { editions } = this.props.data;
    const empty = true;

    return (
      <div className="admin--container admin--editions">
        <DataTable
          source={editions}
          labels={[ "Default" , "Name" , "Status" ]}
          sorter={[ "default" , "name" , "status" ]}
          search={[ "default" , "name" , "status" ]}
          actions={this.renderActions}
          editable
          sourceFields={[{ empty }, ...editionFields]}
          onUpdateSubmit={this.updateEdition}
          fixed
          render={(edition, select, edit) => (
            <tr
              key={edition.id}
              className={cx({ status: edition.status, default: edition.isDefault })}
            >
              {select}
              <td className="mobile">{edition.isDefault.toString()}</td>
              <td className="mobile">{edition.name}</td>
              <td className="mobile">{edition.status}</td>
              {edit}
            </tr>
          )}
        />

        <ResourceCreator
          form="newEdition"
          fields={editionFields}
          onSubmit={this.createEdition}
          validate={validate}
          label="Create Edition"
        />
      </div>
    );
  }
}

export default compose(
  graphql(gql`{ editions { ...edition } } ${edition}`),

  waitForData,

  graphql(
    gql`mutation createEdition($edition: EditionInput!) {
      createEdition(edition: $edition) { ...edition }
    } ${edition}`,
    { name: "createEdition" },
  ),

  graphql(
    gql`mutation updateEdition($id: String!, $edition: EditionInput!) {
      updateEdition(id: $id, edition: $edition) { ...edition }
    } ${edition}`,
    { name: "updateEdition" },
  ),

  graphql(
    gql`mutation setEditionAsDefault($id: String!) {
      setEditionAsDefault(id: $id) { ...edition }
    } ${edition}`,
    { name: "setEditionAsDefault" },
  ),

  graphql(
    gql`mutation deleteEdition($id: String!) {
      deleteEdition(id: $id)
    }`,
    { name: "deleteEdition" },
  ),
)(AdminEditions);
