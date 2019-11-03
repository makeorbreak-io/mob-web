import React, { Component, Fragment } from "react";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

//
// gql
import { workshop } from "fragments";
import { waitForData } from "enhancers";

//
// components
import WorkshopForm, { validate } from "./Workshops.Form";
import { DataTable, Btn } from "components/uikit";
import Workshop from "components/Workshop";

export class AdminWorkshops extends Component {

  //----------------------------------------------------------------------------
  // Event Handlers
  //----------------------------------------------------------------------------
  createWorkshop = (workshop) => {
    const { data, createWorkshop, reset } = this.props;

    return createWorkshop({ variables: { workshop } })
    .then(() => {
      reset();
      data.refetch();
    });
  }

  renderActions = (selected) => (
    <Fragment>
      <Btn
          className="icon icon--small icon--delete"
          confirmation={`Really delete ${selected.length} users?`}
          onClick={() => selected.forEach(console.log)} // eslint-disable-line
      >
        Delete {selected.length} workshops
      </Btn>
    </Fragment>
  )

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { data: { workshops }, formValues, handleSubmit, submitting, submitSucceeded } = this.props;

    return (
      <div className="admin--container">
        <DataTable
          filter
          source={workshops}
          labels={[ "Year" , "Slug" , "Name" , "Date"      , "Signed Up" , "Limit" ]}
          sorter={[ "year" , "slug" , "name" , "shortDate" ]}
          search={[ "year" , "slug" , "name" ]}
          defaultSort="desc"
          actions={this.renderActions}
          render={(workshop, select) => (
            <tr key={workshop.id}>
              {select}
              <td>{workshop.year}</td>
              <td><Link to={`/admin/workshops/${workshop.slug}`}>{workshop.slug}</Link></td>
              <td>{workshop.name}</td>
              <td>{workshop.shortDate}</td>
              <td>{workshop.attendances.length}</td>
              <td>{workshop.participantLimit}</td>
            </tr>
          )}
        />

        <div className="admin--workshops--new">
          <div>
            <h3>Create new workshop</h3>
            <WorkshopForm
              {...{ handleSubmit, submitting, submitSucceeded }}
              buttonLabel="Create Workshop"
              form="newWorkshop"
              save={this.createWorkshop}
            />
          </div>

          <div className="preview">
            <h3>Preview</h3>

            <Workshop
              workshop={{ ...formValues, attendances: [] }}
              showSummary
              showDescription
              showSpeaker
              debug
            />
          </div>
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("AdminWorkshops"),

  reduxForm({
    form: "newWorkshop",
    validate,
  }),

  connect(({ form }) => ({
    formValues: form.newWorkshop.values || {},
  })),

  graphql(gql`{ workshops {
    ...workshop
    users { id name email }
  } } ${workshop}`),

  waitForData,

  graphql(
    gql`mutation createWorkshop($workshop: WorkshopInput!){
      createWorkshop(workshop: $workshop) { ...workshop }
    } ${workshop}`,
    { name: "createWorkshop"},
  )
)(AdminWorkshops);
