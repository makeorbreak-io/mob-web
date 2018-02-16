import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { compose, setDisplayName, mapProps, setPropTypes, defaultProps } from "recompose";
import { connect } from "react-redux";
import { get } from "lodash";

export const FormErrorMessage = ({
  visible,
  error,
  left,
  right,
}) => {
  const cx = classnames("ErrorMessage form", { visible, left, right });

  return (
    <div className={cx}>
      {visible && error}
    </div>
  );
};

export default compose(
  setDisplayName("FormErrorMessage"),

  connect((state, props) => {
    const { form } = props;

    const submitFailed = get(state, `form.${form}.submitFailed`, false);
    const error = get(state, `form.${form}.error`);

    return {
      submitFailed,
      error,
    };
  }),

  mapProps((props) => ({
    ...props,
    visible: props.submitFailed && props.error,
  })),

  setPropTypes({
    form: PropTypes.string.isRequired,
    left: PropTypes.bool.isRequired,
    right: PropTypes.bool.isRequired,
  }),

  defaultProps({
    left: false,
    right: false,
  })
)(FormErrorMessage);
