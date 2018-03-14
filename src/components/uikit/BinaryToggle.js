import React, { Component } from "react";
import { arrayOf, shape, string, func } from "prop-types";
import classnames from "classnames";

export class BinaryToggle extends Component {

  state = {
    selected: 0,
  }

  static propTypes = {
    selected: string,
    options: arrayOf(shape({
      label: string.isRequired,
      value: string.isRequired,
    })).isRequired,
    onChange: func.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected) {
      const selected = nextProps.options.findIndex(({ value }) => value === nextProps.selected);

      this.setState({ selected });
    }
  }

  toggle = () => {
    const { onChange, options } = this.props;
    const selected = 1 - this.state.selected;

    this.setState({ selected });
    onChange(options[selected].value);
  }

  render() {
    const { options } = this.props;
    const { selected } = this.state;

    const indicatorCx = classnames("indicator", { toggled: selected === 1 });

    return (
      <div className="BinaryToggle" onClick={this.toggle}>
        <span className={indicatorCx} />
        {options.slice(0, 2).map(({ label }, i) => (
          <span
            key={i}
            className={classnames("option", { selected: selected === i })}
          >
            {label}
          </span>
        ))}
      </div>
    );
  }

}

export default BinaryToggle;
