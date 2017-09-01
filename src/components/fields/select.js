import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";
import Select from "react-select";

export const SelectField = (props) => {
  const { options, input } = props;

  return (
    <Select
      {...props}
      value={input.value}
      onChange={value => input.onChange(value)}
      onBlur={() => input.onBlur(input.value)}
      options={options}
    />
  );
};

export default compose(
  setDisplayName("SelectField"),

  setPropTypes({
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })).isRequired,
  }),
)(SelectField);
