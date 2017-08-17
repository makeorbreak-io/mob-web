import "./styles";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { Link } from "react-router";
import { map } from "lodash";
import ReactMarkdown from "react-markdown";

//
// components
import WorkshopForm, { validate } from "./form";
import { Tabs, Tab, Panel } from "uikit/tabs";

//
// redux
import { fetchWorkshops, createWorkshop } from "actions/workshops";

export class AdminWorkshops extends Component {

  //----------------------------------------------------------------------------
  // Lifecycle
  //----------------------------------------------------------------------------
  componentDidMount() {
    this.props.dispatch(fetchWorkshops());
  }

  //----------------------------------------------------------------------------
  // Event Handlers
  //----------------------------------------------------------------------------
  createWorkshop = (values) => {
    const { dispatch, reset } = this.props;

    return dispatch(createWorkshop(values))
    .then(dispatch(reset()));
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { workshops, values, handleSubmit, submitting, submitSucceeded } = this.props;

    return (
      <div className="AdminWorkshops">
        <Tabs selected={0}>
          <Tab><span>Workshops</span></Tab>

          <Panel className="clearfix">

            <h3>Current workshops</h3>
            <ul>
            </ul>
            {map(workshops, ({ slug, name }) => (
              <li key={slug}>
                <Link to={`/admin/workshops/${slug}`}>{name}</Link>
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
              <h2>{values.name}</h2>

              <h6>Summary</h6>
              <ReactMarkdown source={values.summary} />

              <h6>Description</h6>
              <ReactMarkdown source={values.description} />

              <h6>Speaker</h6>
              <ReactMarkdown source={values.speaker} />
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

  connect(({ workshops, form }) => ({
    workshops,
    values: form.newWorkshop.values || {},
  })),
)(AdminWorkshops);
