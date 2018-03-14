import React from "react";
import { compose, setDisplayName } from "recompose";

export const FormSectionHeader = ({ children }) => (
  <div className="FormSectionHeader" data-content={children}>
    {children}
  </div>
);

export default compose(
  setDisplayName("FormSectionHeader"),
)(FormSectionHeader);
