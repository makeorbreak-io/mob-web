import React, { Component } from "react";
import { compose, withState } from "recompose";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { waitForData } from "enhancers";
import { competition } from "fragments";

export const withCompetitionSelector = (WrappedComponent) => {
  class WithCompetitionSelector extends Component {
    static defaultProps = {
      onChange: () => {},
    };

    handleChange = (ev) => {
      const { value } = ev.target;
      const { setSelected, onChange } = this.props;

      setSelected(value);
      onChange(value);
    }

    render() {
      const { data: { competitions }, selected } = this.props;

      return (
        <div className="admin--container">
          <div className="admin--container--header">
            <h3>
              Competition:
              <select value={selected} onChange={this.handleChange}>
                <option value="" disabled>Choose a competition</option>
                {competitions.map(competition => (
                  <option key={competition.id} value={competition.id}>
                    {competition.name}{competition.isDefault && " (default)"}
                  </option>
                ))}
              </select>
            </h3>
          </div>

          <WrappedComponent {...this.props} competitionId={selected} />
        </div>
      );
    }
  }

  return compose(
    graphql(gql`{
      competitions { ...competition }
    } ${competition}`),

    waitForData,

    withState("selected", "setSelected", props => props.data.competitions.find(c => c.isDefault).id),
  )(WithCompetitionSelector);
};

export default withCompetitionSelector;
