import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { map } from "lodash";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import WorkshopSummary from "components/Workshops.Summary";

//
// gql
import { workshop } from "fragments";
import { waitForData } from "enhancers";

export class Workshops extends Component {
  render() {
    const { data: { workshops } } = this.props;

    return ( 
        <ul className="Workshops">
          {map(workshops, workshop => (
            <WorkshopSummary workshop={workshop} key={workshop.id} />
          ))}
        </ul>
    );
  }
}

export default compose(
    setDisplayName("Workshops"),
  
    graphql(gql`{ workshops {
      ...workshop
    } } ${workshop}`),
  
    waitForData,
  )(Workshops);