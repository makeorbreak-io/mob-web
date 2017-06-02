import React from "react";
import { compose, setDisplayName } from "recompose";

export const StaticProject = ({ project }) => {
  if (!project) return <div />;

  return (
    <div className="Project static">
      <label>Project</label>

      {project.name}
    </div>
  );
};

export default compose(
  setDisplayName("StaticProject"),
)(StaticProject);
