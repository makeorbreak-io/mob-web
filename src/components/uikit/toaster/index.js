import "./styles";

import React, { Component } from "react";
import { bool } from "prop-types";
import { compose, setDisplayName, setPropTypes, defaultProps } from "recompose";
import { connect } from "react-redux";

export class Toaster extends Component {

  render() {
    const { toasts } = this.props;

    return (
      <div className="Toaster">
        {toasts.map(toast => (
          <div key={toast.id} className="Toast">
            {toast.content}
          </div>
        ))}
      </div>
    );
  }

}

export default compose(
  setDisplayName("Toaster"),

  setPropTypes({
    centered : bool.isRequired,
  }),

  defaultProps({
    centered : false,
  }),

  connect(({ toaster}) => ({ toasts: toaster })),
)(Toaster);
