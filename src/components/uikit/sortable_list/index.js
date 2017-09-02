import "./styles";
import "./styles.responsive";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import { noop } from "lodash";
import {
  SortableContainer as SortableContainerHOC,
  SortableElement as SortableElementHOC,
  arrayMove,
} from "react-sortable-hoc";

const SortableElement = compose(
  SortableElementHOC,
)(({ children }) => (
  children
));

const SortableContainer = compose(
  SortableContainerHOC,
)(({
  items,
  render,
}) => (
  <ul>
    {items.map((value, index) => (
      <SortableElement
        className={"SortableListItem"}
        key={`item-${index}`}
        index={index}
      >
        {render(value, index)}
      </SortableElement>
    ))}
  </ul>
));

export class SortableList extends Component {

  state = {
    items: this.props.items,
  }

  componentWillReceiveProps({ items }) {
    this.setState({ items });
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const items = arrayMove(this.state.items, oldIndex, newIndex);

    this.setState({ items });
    this.props.onUpdate(items);
  }

  render() {
    const { items } = this.state;
    const { render } = this.props;

    return (
      <div className="SortableList">
        <SortableContainer
          items={items}
          onSortEnd={this.onSortEnd}
          render={render}
          lockAxis="y"
          helperClass="SortableListItem dragging"
        />
      </div>
    );
  }

}

export default compose(
  setDisplayName("SortableList"),

  setPropTypes({
    items: PropTypes.array.isRequired,
    render: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
  }),

  defaultProps({
    onUpdate: noop,
    render: noop,
  }),
)(SortableList);
