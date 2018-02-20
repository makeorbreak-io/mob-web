import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, getContext } from "recompose";
import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import { find, isEmpty } from "lodash";
import { Link } from "react-router";

//
// components
import WorkshopForm, { validate } from "components/admin/Workshops.Form";
import { Tabs, Tab, Panel } from "components/uikit/tabs";
import { Button, Modal } from "components/uikit";
import Workshop from "components/Workshop";

//
// redux
import { fetchWorkshops, updateWorkshop, deleteWorkshop } from "actions/workshops";

//
// util
import { toCSV, emailCSVSelector } from "lib/users";

const MODAL_EMAIL_LIST = "MODAL_EMAIL_LIST";

export class AdminEditWorkshop extends Component {

  state = {
    openModal: null,
  }

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
      dispatch(fetchWorkshops({ admin: true }));
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

  openModal = (id) => {
    this.setState({ openModal: id });
  }

  closeModal = () => {
    this.setState({ openModal: null });
  }

  //----------------------------------------------------------------------------
  // Event Handlers
  //----------------------------------------------------------------------------
  render() {
    const { workshop, formValues, handleSubmit, submitting, submitSucceeded } = this.props;
    const { openModal } = this.state;

    if (isEmpty(workshop))
      return <div>"Loading..."</div>;

    return (
      <div className="AdminWorkshops">
        <Modal
          isOpen={openModal === MODAL_EMAIL_LIST}
          title={`Email list for "${workshop.name}"`}
          onRequestClose={this.closeModal}
        >
          <pre>{toCSV(workshop.attendees, emailCSVSelector)}</pre>
        </Modal>
        <Tabs selected={0}>
          <Tab>
            <span>
              <span className="left"><Link to="/admin/workshops">← Back to Workshops</Link></span>
              Edit "{workshop.name}"
              <span className="right">
                <Button
                  small
                  primary
                  onClick={() => this.openModal(MODAL_EMAIL_LIST)}
                >
                  Email List
                </Button>
              </span>
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
