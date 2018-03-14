import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { compose, setDisplayName, mapProps, setPropTypes, defaultProps } from "recompose";
import { connect } from "react-redux";
import { get } from "lodash";

export const ErrorMessage = ({
  visible,
  error,
  left,
  right,
}) => {
  const cx = classnames("ErrorMessage", { visible, left, right });

  return (
    <div className={cx}>
      {visible && error}
    </div>
  );
};

export default compose(
  setDisplayName("ErrorMessage"),

  connect((state, props) => {
    const { form, field } = props;

    const { visited, touched } = get(state, `form.${form}.fields.${field}`, {});
    const submitFailed = get(state, `form.${form}.submitFailed`, false);

    const { syncErrors, asyncErrors, submitErrors } = get(state, `form.${form}`, {});
    const error = {
      ...syncErrors,
      ...asyncErrors,
      ...submitErrors,
    }[field];

    return {
      visited,
      touched,
      submitFailed,
      error,
    };
  }),

  mapProps((props) => ({
    ...props,
    visible: (props.touched || props.submitFailed) && !!props.error,
  })),

  setPropTypes({
    form: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    left: PropTypes.bool.isRequired,
    right: PropTypes.bool.isRequired,
  }),

  defaultProps({
    left: false,
    right: false,
  })
)(ErrorMessage);
