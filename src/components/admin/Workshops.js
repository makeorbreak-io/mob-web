import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { Link } from "react-router";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { workshop } from "fragments";
import { waitForData } from "enhancers";

//
// components
import WorkshopForm, { validate } from "./Workshops.Form";
import { Tabs, Tab, Panel } from "components/uikit/tabs";
import Workshop from "components/Workshop";

//
// util
// import { sortedWorkshops } from "lib/workshops";

export class AdminWorkshops extends Component {

  //----------------------------------------------------------------------------
  // Event Handlers
  //----------------------------------------------------------------------------
  createWorkshop = (workshop) => {
    const { data, createWorkshop, reset } = this.props;

    return createWorkshop({
      variables: { workshop },
    })
    .then(() => reset())
    .then(() => data.refetch());
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { data, formValues, handleSubmit, submitting, submitSucceeded } = this.props;

    const workshops = data.workshops.edges.map(e => e.node);

    return (
      <div className="AdminWorkshops">
        <Tabs selected={0}>
          <Tab>
            <span>
              <span className="left"><Link to="/admin">← Back to Admin</Link></span>
              Workshops
            </span>
          </Tab>

          <Panel className="clearfix">

            <h3>Current workshops</h3>
            <ul>
            </ul>
            {/*sortedWorkshops(workshops).map(({ slug, name, short_date }) => (*/}
            {workshops.map(({ slug, name, shortDate }) => (
              <li key={slug}>
                <Link to={`/admin/workshops/${slug}`}>{name} ({shortDate})</Link>
              </li>
            ))}

            <h3>Create new workshop</h3>
            <WorkshopForm
              {...{ handleSubmit, submitting, submitSucceeded }}
              buttonLabel="Create Workshop"
              form="newWorkshop"
              save={this.createWorkshop}
            />

            <div className="preview">
              <h1>Preview</h1>

              <Workshop
                workshop={{ ...formValues, attendances: [] }}
                showSummary
                showDescription
                showSpeaker
                debug
              />
            </div>

          </Panel>
        </Tabs>

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

  graphql(gql`{ workshops(first: 24) { edges { node {
    ...workshop
    users { id name email }
  } } } } ${workshop}`),

  waitForData,

  graphql(
    gql`mutation createWorkshop($workshop: WorkshopInput!){
      createWorkshop(workshop: $workshop) { ...workshop }
    } ${workshop}`,
    { name: "createWorkshop"},
  )
)(AdminWorkshops);
