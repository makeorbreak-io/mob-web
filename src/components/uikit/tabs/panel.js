import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";

export const Panel = ({ isSelected, children }) => {
  const cx = classnames("Panel", { selected: isSelected });

  return (
    <div className={cx}>
      {children}
    </div>
  );
};

export default compose(
  setDisplayName("Panel"),

  setPropTypes({
    isSelected: PropTypes.bool.isRequired,
  }),

  defaultProps({
    isSelected: false,
  }),
)(Panel);

