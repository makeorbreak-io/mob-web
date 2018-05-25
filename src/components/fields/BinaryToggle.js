import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";

import { BinaryToggle } from "components/uikit";

export const BinaryToggleField = (props) => {
  const { options, input } = props;

  return (
    <BinaryToggle
      {...props}
      selected={input.value}
      onChange={value => input.onChange(value)}
      onBlur={() => input.onBlur(input.value)}
      options={options}
    />
  );
};

export default compose(
  setDisplayName("BinaryToggleField"),

  setPropTypes({
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })).isRequired,
  }),
)(BinaryToggleField);
