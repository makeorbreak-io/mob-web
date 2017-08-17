import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, getContext } from "recompose";
import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import { find, isEmpty } from "lodash";
import ReactMarkdown from "react-markdown";

//
// components
import WorkshopForm, { validate } from "./form";
import { Tabs, Tab, Panel } from "uikit/tabs";

//
// redux
import { fetchWorkshops, updateWorkshop, deleteWorkshop } from "actions/workshops";

export class AdminEditWorkshop extends Component {

  //----------------------------------------------------------------------------
  // Lifecycle
  //----------------------------------------------------------------------------
  componentWillMount() {
    const { initialize, workshop, dispatch } = this.props;

    if (!isEmpty(workshop))
      initialize(workshop);
    else
      dispatch(fetchWorkshops());
  }

  componentWillReceiveProps(nextProps) {
    if (isEmpty(this.props.workshop) && !isEmpty(nextProps.workshop)) {
      this.props.initialize(nextProps.workshop);
    }
  }

  //----------------------------------------------------------------------------
  // Event Handlers
  //----------------------------------------------------------------------------
  updateWorkshop = (values) => {
    this.props.dispatch(updateWorkshop(values.slug, values));
  }

  deleteWorkshop = () => {
    const { dispatch, workshop, router } = this.props;

    return dispatch(deleteWorkshop(workshop.slug))
    .then(() => router.push("/admin/workshops"));
  }

  //----------------------------------------------------------------------------
  // Event Handlers
  //----------------------------------------------------------------------------
  render() {
    const { workshop, values, handleSubmit, submitting, submitSucceeded } = this.props;

    if (isEmpty(workshop))
      return <div>"Loading..."</div>;

    return (
      <div className="AdminWorkshops">
        <Tabs selected={0}>
          <Tab><span>Edit Workshop "{workshop.name}"</span></Tab>

          <Panel className="clearfix">
            <h3>Edit workshop</h3>

            <WorkshopForm
              {...{ handleSubmit, submitting, submitSucceeded }}
              buttonLabel="Update Workshop"
              form="editWorkshop"
              save={this.updateWorkshop}
              remove={this.deleteWorkshop}
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
  setDisplayName("AdminEditWorkshop"),

  getContext({
    router: PropTypes.object.isRequired,
  }),

  reduxForm({
    form: "editWorkshop",
    validate,
  }),

  connect(({ workshops, form }, props) => ({
    workshop: find(workshops, w => w.slug === props.params.slug),
    values: form.editWorkshop.values || {},
  })),
)(AdminEditWorkshop);
