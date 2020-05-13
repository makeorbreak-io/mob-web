import React from "react";
import classnames from "classnames";
import { compose, setDisplayName } from "recompose";

export const Tab = ({
  index,
  isSelected,
  setSelected,
  children,
}) => {
  const cx = classnames("tab", { selected: isSelected });

  return (
    <div className={cx} data-step={index + 1} onClick={() => setSelected(index)}>
      {children}
    </div>
  );
};

export default compose(
  setDisplayName("Tab"),
)(Tab);

