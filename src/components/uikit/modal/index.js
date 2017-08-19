import "./styles";
import "./styles.responsive";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import classnames from "classnames";
import { noop } from "lodash";

export class Modal extends Component {

  //----------------------------------------------------------------------------
  // Lifecycle
  //----------------------------------------------------------------------------
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  //----------------------------------------------------------------------------
  // Event handlers
  //----------------------------------------------------------------------------
  handleKeyDown = (e) => {
    if (e.key === "Escape") {
      this.props.onRequestClose();
    }
  }

  handleClickOutside = () => {
    this.props.onRequestClose();
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { isOpen, title, children, onRequestClose } = this.props;
    const cx = classnames("Modal", { open: isOpen });

    return (
      <div className={cx}>
        <div className="modal-overlay" onClick={onRequestClose}>
          <h1 className="title" onClick={e => e.stopPropagation()}>
            <span className="ellipsis">{title}</span>
            <span className="close" onClick={onRequestClose}>×</span>
          </h1>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {children}
          </div>
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("Modal"),

  setPropTypes({
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string,
    onRequestClose: PropTypes.func,
  }),

  defaultProps({
    isOpen: false,
    onRequestClose: noop,
  }),
)(Modal);
