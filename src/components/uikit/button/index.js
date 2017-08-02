import "./styles";

import React, { Component } from "react";
import { oneOf, bool, func, string, number } from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import classnames from "classnames";
import { noop, omit, isNull } from "lodash";

//
// Components
import Spinner from "uikit/spinner";

export class Button extends Component {

  state = {
    showSuccess: false,
  }

  //----------------------------------------------------------------------------
  // Lifecycle
  //----------------------------------------------------------------------------
  componentWillReceiveProps(nextProps) {
    // successful submit happened 
    if (this.props.loading && !nextProps.loading && nextProps.submitSucceeded) {
      this.setState({ showSuccess: true }, () => {
        window.setTimeout(() => this.setState({ showSuccess: false }), this.props.feedbackDuration);
      });
    }
  }

  //----------------------------------------------------------------------------
  // Callbacks
  //----------------------------------------------------------------------------
  handleClick = () => {
    const { confirmation, onClick } = this.props;

    if (isNull(confirmation)) return onClick();

    return window.confirm(confirmation) ? onClick() : null;
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { type, disabled, className, children, loading, ...styles } = this.props;
    const { showSuccess } = this.state;

    const cx = classnames("Button", className, { loading, disabled, ...omit(styles, "feedbackDuration") });

    let content = children;
    if (loading) content = <Spinner />;
    if (showSuccess) content = "Updated! ✔";

    return (
      <button className={cx} onClick={this.handleClick} {...{ type, disabled }}>
        {content}
      </button>
    );
  }
}

export default compose(
  setDisplayName("Button"),

  setPropTypes({
    type             : oneOf([ "button", "submit" ]),
    disabled         : bool.isRequired,
    onClick          : func.isRequired,
    className        : string,
    primary          : bool.isRequired,
    success          : bool.isRequired,
    warning          : bool.isRequired,
    danger           : bool.isRequired,
    cta              : bool.isRequired,
    nobg             : bool.isRequired,
    framed           : bool.isRequired,
    straight         : bool.isRequired,
    hollow           : bool.isRequired,
    fullwidth        : bool.isRequired,
    halfwidth        : bool.isRequired,
    fakelink         : bool.isRequired,
    small            : bool.isRequired,
    bold             : bool.isRequired,
    form             : bool.isRequired,
    centered         : bool.isRequired,
    loading          : bool.isRequired,
    submitSucceeded  : bool.isRequired,
    feedbackDuration : number.isRequired, // milliseconds
    confirmation     : string,
  }),

  defaultProps({
    type             : "button",
    disabled         : false,
    onClick          : noop,
    primary          : false,
    success          : false,
    warning          : false,
    danger           : false,
    cta              : false,
    nobg             : false,
    framed           : false,
    straight         : false,
    hollow           : false,
    fullwidth        : false,
    halfwidth        : false,
    fakelink         : false,
    small            : false,
    bold             : false,
    form             : false,
    centered         : false,
    loading          : false,
    submitSucceeded  : false,
    feedbackDuration : 3000,
    confirmation     : null,
  }),
)(Button);
