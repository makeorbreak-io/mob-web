import React, { Component } from "react";
import { compose, withState } from "recompose";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { waitForData } from "enhancers";
import { edition } from "fragments";

export const withEditionSelector = (WrappedComponent) => {
  class WithEditionSelector extends Component {
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
      const { data: { editions }, selected } = this.props;

      return (
        <div className="admin--container">
          <div className="admin--container--header">
            <h3>
              Edition:
              <select value={selected} onChange={this.handleChange}>
                <option value="" disabled>Choose a edition</option>
                {editions.map(edition => (
                  <option key={edition.id} value={edition.id}>
                    {edition.name}{edition.isDefault && " (default)"}
                  </option>
                ))}
              </select>
            </h3>
          </div>

          <WrappedComponent {...this.props} editionId={selected} />
        </div>
      );
    }
  }

  return compose(
    graphql(gql`{
      editions { ...edition }
    } ${edition}`),

    waitForData,

    withState("selected", "setSelected", props => props.data.editions.find(c => c.isDefault).id),
  )(WithEditionSelector);
};

export default withEditionSelector;
