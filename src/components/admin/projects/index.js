import "./styles";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { connect } from "react-redux";
import { values } from "lodash";

//
// components
import { DataTable } from "uikit";

//
// redux
import { fetchProjects, clearProjects } from "actions/projects";

export class AdminProjects extends Component {

  //----------------------------------------------------------------------------
  // Lifecycle
  //----------------------------------------------------------------------------
  componentDidMount() {
    this.props.dispatch(fetchProjects({ admin: false })); // FIXME: change to true when endpoint available
  }

  componentWillUnmount() {
    this.props.dispatch(clearProjects());
  }

  render() {
    const { projects } = this.props;

    return (
      <div className="AdminProjects">
        <DataTable
          source={projects}
          labels={[ "Name" , "Technologies" ]}
          sorter={[ "name" , null ]}
          render={project => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.technologies.join(", ")}</td>
            </tr>
          )}
        />
      </div>
    );
  }

}

export default compose(
  setDisplayName("AdminProjects"),

  connect(({ projects }) => ({ projects: values(projects) })),
)(AdminProjects);
