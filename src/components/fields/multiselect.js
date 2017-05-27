import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes } from "recompose";
import Select from "react-select";

export const Multiselect = (props) => {
  const { options, input } = props;

  return (
    <Select
      {...this.props}
      value={input.value}
      onChange={(value) => input.onChange(value)}
      onBlur={() => input.onBlur(input.value)}
      options={options}
      multi
    />
  );
};

export default compose(
  setDisplayName("EditableProject"),

  setPropTypes({
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })).isRequired,
  }),
)(Multiselect);
