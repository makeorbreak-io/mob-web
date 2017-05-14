import "./styles"

import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import classnames from "classnames";
import { noop } from "lodash";

//
// Components
import Spinner from "uikit/spinner";

export const Button = ({
  type,
  disabled,
  onClick,
  className,
  children,
  primary, success, warning, danger, hollow, fullwidth, fakelink, small, loading, form
}) => {
  const cx = classnames("Button", className, {
    disabled, primary, success, warning, danger, hollow, fullwidth, fakelink, small, loading, form,
  });

  return (
    <button className={cx} {...{ type, disabled, onClick }}>
      { loading ? <Spinner /> : children }
    </button>
  );
}

export default compose(
  setDisplayName("Button"),

  setPropTypes({
    type      : PropTypes.oneOf([ "button", "submit" ]),
    disabled  : PropTypes.bool.isRequired,
    onClick   : PropTypes.func.isRequired,
    className : PropTypes.string,
    primary   : PropTypes.bool.isRequired,
    success   : PropTypes.bool.isRequired,
    warning   : PropTypes.bool.isRequired,
    danger    : PropTypes.bool.isRequired,
    hollow    : PropTypes.bool.isRequired,
    fullwidth : PropTypes.bool.isRequired,
    fakelink  : PropTypes.bool.isRequired,
    small     : PropTypes.bool.isRequired,
    form      : PropTypes.bool.isRequired,
    loading   : PropTypes.bool.isRequired,
  }),

  defaultProps({
    type      : "button",
    disabled  : false,
    onClick   : noop,
    primary   : false,
    success   : false,
    warning   : false,
    danger    : false,
    hollow    : false,
    fullwidth : false,
    fakelink  : false,
    small     : false,
    form      : false,
    loading   : false,
  }),
)(Button);
