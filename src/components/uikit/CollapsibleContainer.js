import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export class CollapsibleContainer extends Component {
  static propTypes = {
    defaultExpanded: PropTypes.bool,
    preview: PropTypes.node.isRequired,
  }

  state = {
    expanded: this.props.defaultExpanded || false,
  }

  toggleExpanded = () => this.setState({ expanded: !this.state.expanded });

  render() {
    const { preview, children } = this.props;
    const { expanded } = this.state;

    return (
      <div
        className={classnames("collapsible-container", { expanded })}
      >
        <div
          className="collapsible-container--preview no-select"
          onClick={this.toggleExpanded}
        >
          {preview}
        </div>
        <div className="collapsible-container--content">{children}</div>
        <div
          className={classnames("collapsible-container--toggle", "no-select", "icon", {
           "icon--expand-less": expanded,
           "icon--expand-more": !expanded,
          })}
          onClick={this.toggleExpanded}
        / >
      </div>
    );
  }
}

export default CollapsibleContainer;
