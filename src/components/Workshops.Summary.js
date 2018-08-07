import React, { Component } from "react";
import { Link } from "react-router";

import env from "config/environment";

export class WorkshopSummary extends Component {
  render() {
    const { workshop } = this.props;

    if (!workshop) return null;
    const { name, slug, summary, speaker } = workshop;

    return ( 
        <li className="WorkshopSummary">
          <img src={`${env.assetHost}/images/workshops/${slug}.svg`} alt={name} />
          <h2>{name}</h2>
          <h6>Summary</h6>
          <div>{summary}</div>
          <h6>Speaker</h6>
          <div>{speaker}</div>
          <Link to={`/workshops/${slug}`}>{slug}</Link>
        </li>
    );
  }
}

export default WorkshopSummary;