import React from "react";
import { compose, setDisplayName } from "recompose";

export const StaticProject = ({ project }) => {
  return (
    <div className="Project static">
      {project.id}
    </div>
  );
};

export default compose(
  setDisplayName("StaticProject"),
)(StaticProject);
