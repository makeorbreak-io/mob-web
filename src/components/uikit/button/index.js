import "./styles";

import React from "react";
import { oneOf, bool, func, string } from "prop-types";
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
  loading,
  ...styles
}) => {
  const cx = classnames("Button", className, { loading, disabled, ...styles });

  return (
    <button className={cx} {...{ type, disabled, onClick }}>
      { loading ? <Spinner /> : children }
    </button>
  );
};

export default compose(
  setDisplayName("Button"),

  setPropTypes({
    type      : oneOf([ "button", "submit" ]),
    disabled  : bool.isRequired,
    onClick   : func.isRequired,
    className : string,
    primary   : bool.isRequired,
    success   : bool.isRequired,
    warning   : bool.isRequired,
    danger    : bool.isRequired,
    hollow    : bool.isRequired,
    fullwidth : bool.isRequired,
    fakelink  : bool.isRequired,
    small     : bool.isRequired,
    bold      : bool.isRequired,
    form      : bool.isRequired,
    centered  : bool.isRequired,
    loading   : bool.isRequired,
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
    bold      : false,
    form      : false,
    centered  : false,
    loading   : false,
  }),
)(Button);
