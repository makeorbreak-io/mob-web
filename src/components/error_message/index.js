import "./styles";

import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { compose, setDisplayName, mapProps, setPropTypes } from "recompose";
import { connect } from "react-redux";
import { get } from "lodash";

export const ErrorMessage = ({
  visible,
  error,
}) => {
  const cx = classnames("ErrorMessage", { visible });
  
  return (
    <div className={cx}>
      {error}
    </div>
  );
}

export default compose(
  setDisplayName("ErrorMessage"),

  connect((state, props) => {
    const { form, field } = props;

    const { visited, touched } = get(state, `form.${form}.fields.${field}`, {});
    const error = get(state, `form.${form}.syncErrors.${field}`, null);
    const submitFailed = get(state, `form.${form}.submitFailed`, false);

    return {
      visited,
      touched,
      error,
      submitFailed,
    };
  }),

  mapProps((props) => ({
    ...props,
    visible: ((props.visited && props.touched) || props.submitFailed),
  })),

  setPropTypes({
    form: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
  }),
)(ErrorMessage);
