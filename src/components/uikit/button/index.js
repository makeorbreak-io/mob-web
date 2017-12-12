import "./styles";

import React, { Component } from "react";
import { oneOf, bool, func, string, number } from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import classnames from "classnames";
import { noop, omit, isNull } from "lodash";
import { connect } from "react-redux";

//
// Components
import Spinner from "uikit/spinner";

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
      top >=0 &&
      left >= 0 &&
      bottom <= (innerHeight || clientHeight) &&
      right <= (innerWidth || clientWidth)
    );
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { type, className, children, feedbackSuccessLabel, feedbackFailureLabel, ...styles } = this.props;
    const { showSuccess, showFailure } = this.state;

    const disabled = this.props.disabled || this.state.disabled;
    const loading  = this.props.loading  || this.state.loading;

    const cx = classnames("Button", className, {
      loading,
      disabled,
      ...omit(styles, "submitSucceeded", "submitFailed", "feedbackDuration", "confirmation"),
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
        {...{ type, disabled }}
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
    inactive             : bool.isRequired,
    onClick              : func.isRequired,
    className            : string,
    primary              : bool.isRequired,
    success              : bool.isRequired,
    warning              : bool.isRequired,
    danger               : bool.isRequired,
    cta                  : bool.isRequired,
    nobg                 : bool.isRequired,
    framed               : bool.isRequired,
    outline              : bool.isRequired,
    straight             : bool.isRequired,
    hollow               : bool.isRequired,
    fullwidth            : bool.isRequired,
    halfwidth            : bool.isRequired,
    fakelink             : bool.isRequired,
    small                : bool.isRequired,
    bold                 : bool.isRequired,
    form                 : bool.isRequired,
    centered             : bool.isRequired,
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
    inactive             : false,
    onClick              : noop,
    primary              : false,
    success              : false,
    warning              : false,
    danger               : false,
    cta                  : false,
    nobg                 : false,
    framed               : false,
    outline              : false,
    straight             : false,
    hollow               : false,
    fullwidth            : false,
    halfwidth            : false,
    fakelink             : false,
    small                : false,
    bold                 : false,
    form                 : false,
    centered             : false,
    loading              : false,

    submitSucceeded      : false,
    submitFailed         : false,
    feedbackDuration     : 2000,
    feedbackSuccessLabel : "Updated!",
    feedbackFailureLabel : "Update failed",
    disableFeedback      : false,
    confirmation         : null,
    buttonRef            : () => {},
  }),

  connect(),
)(Button);
