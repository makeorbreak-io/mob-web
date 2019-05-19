import React, { Component } from "react";
import { oneOf, bool, func, string, number } from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import classnames from "classnames";
import { noop, isNull } from "lodash";
import { connect } from "react-redux";

//
// Components
import Spinner from "components/uikit/Spinner";

//
// redux
import { addToast } from "actions/toaster";

export class Button extends Component {

  state = {
    showSuccess: false,
    showFailure: false,
    loading: false,
    disabled: false,
  }

  //----------------------------------------------------------------------------
  // Lifecycle
  //----------------------------------------------------------------------------
  componentWillReceiveProps(nextProps) {
    const {
      loading,
      submitSucceeded,
      submitFailed,
      feedbackSuccessLabel,
      feedbackFailureLabel,
      dispatch,
    } = nextProps;

    if (this.props.loading && !loading) {
      if (!this.inViewport()) {
        dispatch(addToast({
          content: (submitSucceeded && feedbackSuccessLabel) || (submitFailed && feedbackFailureLabel),
        }));
      }

      this.setState({
        showSuccess: submitSucceeded,
        showFailure: submitFailed,
      }, () => {
        window.setTimeout(() => this.setState({
          showSuccess: false,
          showFailure: false,
        }), this.props.feedbackDuration);
      });
    }
  }

  //----------------------------------------------------------------------------
  // Callbacks
  //----------------------------------------------------------------------------
  handleClick = () => {
    const { confirmation, onClick, disableFeedback } = this.props;

    if (!isNull(confirmation) && !window.confirm(confirmation)) return null;

    const result = onClick();

    if (!disableFeedback && result && result.then) {
      this.setState({ loading: true, disabled: true });

      result
      .then(()    => this.showFeedback("showSuccess"))
      .catch(()   => this.showFeedback("showFailure"))
      .finally(() => this.setState({ loading: false, disabled: false }));
    }
  }

  //----------------------------------------------------------------------------
  // Helpers
  //----------------------------------------------------------------------------
  showFeedback = (key) => {
    this.setState({ [key]: true }, () => {
      window.setTimeout(
        () => this.setState({ [key]: false }),
        this.props.feedbackDuration
      );
    });
  }

  // https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
  inViewport = () => {
    if (!this.node) return;

    const { top, left, bottom, right } = this.node.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    const { documentElement: { clientHeight, clientWidth } } = document;

    return (
      top >=  0 &&
      left >= 0 &&
      bottom <= (innerHeight || clientHeight) &&
      right <= (innerWidth || clientWidth)
    );
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { type, className, children, feedbackSuccessLabel, feedbackFailureLabel } = this.props;
    const { showSuccess, showFailure } = this.state;

    const disabled = this.props.disabled || this.state.disabled;
    const loading  = this.props.loading  || this.state.loading;

    const cx = classnames("btn", className, {
      loading,
      disabled,
    });

    let content = children;
    if (loading) content = <Spinner />;
    if (showSuccess) content = feedbackSuccessLabel;
    if (showFailure) content = feedbackFailureLabel;

    return (
      <button
        ref={node => { this.node = node; this.props.buttonRef(node); } }
        className={cx}
        onClick={this.handleClick}
        type={type}
        disabled={disabled}
      >
        {content}
      </button>
    );
  }
}

export default compose(
  setDisplayName("Button"),

  setPropTypes({
    type                 : oneOf([ "button", "submit" ]),
    disabled             : bool.isRequired,
    onClick              : func.isRequired,
    className            : string,
    loading              : bool.isRequired,
    submitSucceeded      : bool.isRequired,
    submitFailed         : bool.isRequired,
    feedbackDuration     : number.isRequired, // milliseconds
    feedbackSuccessLabel : string.isRequired,
    feedbackFailureLabel : string.isRequired,
    disableFeedback      : bool.isRequired,
    confirmation         : string,
    buttonRef            : func.isRequired,
  }),

  defaultProps({
    type                 : "button",
    disabled             : false,
    onClick              : noop,
    loading              : false,
    submitSucceeded      : false,
    submitFailed         : false,
    feedbackDuration     : 3000,
    feedbackSuccessLabel : "Updated!",
    feedbackFailureLabel : "Update failed",
    disableFeedback      : false,
    confirmation         : null,
    buttonRef            : () => {},
  }),

  connect(),
)(Button);

