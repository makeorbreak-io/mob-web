import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, getContext } from "recompose";
import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import { find, isEmpty } from "lodash";
import { Link } from "react-router";

//
// components
import WorkshopForm, { validate } from "./form";
import { Tabs, Tab, Panel } from "uikit/tabs";
import Workshop from "components/workshop";

//
// redux
import { fetchWorkshops, updateWorkshop, deleteWorkshop } from "actions/workshops";

export class AdminEditWorkshop extends Component {

  //----------------------------------------------------------------------------
  // Lifecycle
  //----------------------------------------------------------------------------
  componentWillMount() {
    const { initialize, workshop, dispatch } = this.props;

    if (!isEmpty(workshop)) {
      workshop.participant_limit = workshop.participant_limit.toString();
      workshop.year = workshop.year.toString();

      initialize(workshop);
    }
    else {
      dispatch(fetchWorkshops());
    }
  }

  componentWillReceiveProps(nextProps) {
    const { workshop } = nextProps;

    if (isEmpty(this.props.workshop) && !isEmpty(workshop)) {
      workshop.participant_limit = workshop.participant_limit.toString();
      workshop.year = workshop.year.toString();

      this.props.initialize(workshop);
    }
  }

  //----------------------------------------------------------------------------
  // Event Handlers
  //----------------------------------------------------------------------------
  updateWorkshop = (values) => {
    return this.props.dispatch(updateWorkshop(values.slug, values));
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
    const { workshop, formValues, handleSubmit, submitting, submitSucceeded } = this.props;

    if (isEmpty(workshop))
      return <div>"Loading..."</div>;

    return (
      <div className="AdminWorkshops">
        <Tabs selected={0}>
          <Tab>
            <span>
              <span className="left"><Link to="/admin/workshops">← Back to Workshops</Link></span>
              Edit Workshop "{workshop.name}"
            </span>
          </Tab>

          <Panel className="clearfix">
            <h3>
              Edit workshop
            </h3>

            <WorkshopForm
              {...{ handleSubmit, submitting, submitSucceeded }}
              buttonLabel="Update Workshop"
              form="editWorkshop"
              save={this.updateWorkshop}
              remove={this.deleteWorkshop}
            />

            <div className="preview">
              <h1>Preview</h1>

              <Workshop
                workshop={formValues}
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
    formValues: form.editWorkshop.values || {},
  })),
)(AdminEditWorkshop);
