import React from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import Select, { Creatable } from "react-select";

export const Multiselect = (props) => {
  const { creatable, options, input } = props;

  const Component = creatable ? Creatable : Select;

  return (
    <Component
      {...props}
      value={input.value}
      onChange={(value) => input.onChange(value)}
      onBlur={() => input.onBlur(input.value)}
      options={options}
      multi
    />
  );
};

export default compose(
  setDisplayName("Multiselect"),

  setPropTypes({
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })).isRequired,

    creatable: PropTypes.bool.isRequired,
  }),

  defaultProps({
    creatable: false,
  }),
)(Multiselect);
