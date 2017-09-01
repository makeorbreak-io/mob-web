import "./styles";

import React, { Component, cloneElement } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import { filter, map, isNull } from "lodash";

export class Tabs extends Component {

  state = {
    selected: 0,
  }

  //---------------------------------------------------------------------------
  // Callbacks
  //---------------------------------------------------------------------------
  setSelected = (selected) => {
    this.setState({ selected });
  }

  //---------------------------------------------------------------------------
  // Helpers
  //---------------------------------------------------------------------------
  get Tabs() {
    const children = React.Children.toArray(this.props.children);
    const { setSelected } = this;
    const { selected } = isNull(this.props.selected) ? this.state : this.props;

    return [
      children => filter(children, c => c.type.displayName === "Tab"),
      children => map(children, (c, i) => cloneElement(c, { index: i, isSelected: i === selected, setSelected })),
    ].reduce((x, f) => f(x), children);
  }

  get Panels() {
    const children = React.Children.toArray(this.props.children);
    const { setSelected } = this;
    const { selected } = isNull(this.props.selected) ? this.state : this.props;

    return [
      children => filter(children, c => c.type.displayName === "Panel"),
      children => map(children, (c, i) => cloneElement(c, { index: i, isSelected: i === selected, setSelected })),
    ].reduce((x, f) => f(x), children);
  }

  //---------------------------------------------------------------------------
  // Render
  //---------------------------------------------------------------------------
  render() {
    const { green, small, showIndex, className } = this.props;
    const { selected } = isNull(this.props.selected) ? this.state : this.props;

    const indicatorWidth = 100 / this.Tabs.length;
    const style = {
      width: `${indicatorWidth}%`,
      left: `${indicatorWidth * selected}%`,
    };

    const cx = classnames("Tabs", className, {
      green,
      small,
      "show-index": showIndex,
      "tabs-disabled": !isNull(this.props.selected),
    });

    return (
      <div className={cx}>
        <div className="TabList">
          {this.Tabs}
          <div className="selected-indicator" style={style} />
        </div>
        {this.Panels}
      </div>
    );
  }

}

export default compose(
  setDisplayName("Tabs"),

  setPropTypes({
    showIndex: PropTypes.bool.isRequired,
    green: PropTypes.bool.isRequired,
    small: PropTypes.bool.isRequired,
    selected: PropTypes.number,
    className: PropTypes.string,
  }),

  defaultProps({
    showIndex: false,
    green: false,
    small: false,
    selected: null,
  }),
)(Tabs);
